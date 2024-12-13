import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from "../Secrets";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Async Thunks for Firestore CRUD operations

// Add Workout
export const addWorkoutThunk = createAsyncThunk(
  'workoutfirebase/addWorkout',
  async (workoutData) => {
      const workoutsCollRef = collection(db, 'workouts');
      const workoutSnap = await addDoc(workoutsCollRef, {
        image: workoutData.image || '',
        workoutType: workoutData.workoutType || '',
        startTime: workoutData.startTime || '',
        duration: workoutData.duration || '',
        calories: workoutData.calories || '',
        location: workoutData.location || '',
      });
      const newWorkout = { key: workoutSnap.id, ...workoutData };
      return newWorkout;

    }

);


// Update Workout
export const updateWorkoutThunk = createAsyncThunk(
  'workoutfirebase/updateWorkout',
  async (workout) => {
    const docToUpdate = doc(db, 'workouts', workout.item.key);
    await updateDoc(docToUpdate, {
      image: workout.workoutData.image || '',
      workoutType: workout.workoutData.workoutType || '',
      startTime: workout.workoutData.startTime || '',
      duration: workout.workoutData.duration || '',
      calories: workout.workoutData.calories || '',
      location: workout.workoutData.location || '',
    });
    return workout;
  }
);



// Delete Workout
export const deleteWorkoutThunk = createAsyncThunk(
  'workoutfirebase/deleteWorkout',
  async (workoutId) => {
    const docToDelete = doc(db, 'workouts', workoutId);
    await deleteDoc(docToDelete);
    return workoutId;
  }
);

// Get Workouts
export const getWorkoutsThunk = createAsyncThunk(
  'workoutfirebase/getWorkouts',
  async () => {
    const workoutsList = [];
    const workoutsCollRef = collection(db, 'workouts');
    const querySnapshot = await getDocs(workoutsCollRef);
    querySnapshot.docs.forEach((docSnapshot) => {
      const workout = docSnapshot.data();
      workout.key = docSnapshot.id;
      workoutsList.push(workout);
    });
    return workoutsList;
  }
);

// Workouts Slice
export const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: {
    list: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWorkoutThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateWorkoutThunk.fulfilled, (state, action) => {
        const {item, workoutData} = action.payload;
        const newItem = {
          key: item.key,
          ...workoutData,
        };
        state.list = state.list.map(workout => {
          if (workout.key === item.key) {
            return newItem;
          }
          return workout;
        });
      })
      .addCase(deleteWorkoutThunk.fulfilled, (state, action) => {
        const deletedWorkoutKey = action.payload;
        state.list = state.list.filter(workout => workout.key !== deletedWorkoutKey);
      })
      .addCase(getWorkoutsThunk.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});



export default workoutsSlice.reducer;

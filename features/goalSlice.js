import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { firebaseConfig } from "../Secrets";
import AsyncStorage from "@react-native-async-storage/async-storage";

let app;
const apps = getApps();
if (apps.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);

async function saveGoalDocId(docId) {
  await AsyncStorage.setItem("goalDocId", docId);
}

export const fetchGoal = createAsyncThunk("goal/fetchGoal", async () => {
  const savedDocId = await AsyncStorage.getItem("goalDocId");
  if (!savedDocId) {
    return null;
  }

  const docRef = doc(db, "goal", savedDocId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const goal = docSnap.data();
    goal.key = docSnap.id;
    return goal;
  } else {
    return null;
  }
});

export const addGoal = createAsyncThunk("goal/addGoal", async (goal) => {
  try {
    const goalCollRef = collection(db, "goal");
    const goalSnap = await addDoc(goalCollRef, goal);
    const newGoal = { key: goalSnap.id, ...goal };
    return newGoal;
  } catch (error) {
    throw error;
  }
});

export const updateGoal = createAsyncThunk("goal/updateGoal", async (goal) => {
  try {
    const docToUpdate = doc(db, "goal", goal.key);
    await updateDoc(docToUpdate, goal);
    return goal;
  } catch (error) {
    throw error;
  }
});

const goalSlice = createSlice({
  name: "goal",
  initialState: {
    personalGoal: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
    });

    builder.addCase(addGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
      saveGoalDocId(action.payload.key);
    });

    builder.addCase(updateGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
    });
  },
});

export default goalSlice.reducer;

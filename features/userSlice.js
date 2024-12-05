import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../Secrets";

let app;
const apps = getApps();
if (apps.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);

export const fetchGoal = createAsyncThunk("user/fetchGoal", async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const personalGoal = userSnapshot.data().personalGoal;
      return personalGoal;
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
});

export const addGoal = createAsyncThunk(
  "user/addGoal",
  async ({ userId, goal }) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { personalGoal: goal });
      return goal;
    } catch (error) {
      throw error;
    }
  }
);

export const updateGoal = createAsyncThunk(
  "user/updateGoal",
  async ({ userId, updatedGoal }) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { personalGoal: updatedGoal });
      return updatedGoal;
    } catch (error) {
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    personalGoal: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
    });

    builder.addCase(addGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
    });

    builder.addCase(updateGoal.fulfilled, (state, action) => {
      state.personalGoal = action.payload;
    });
  },
});

export default userSlice.reducer;

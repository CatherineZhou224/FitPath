import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "../Secrets";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

// Firebase initialization
let app;
const apps = getApps();
if (apps.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);
const storage = getStorage(app);

// Upload image
export const setPicture = createAsyncThunk(
  'app/setPicture',
  async (pictureObject, { getState }) => {
    const fileName = pictureObject.uri.split('/').pop();
    const currentPhotoRef = ref(storage, `images/${fileName}`);
    try {
      const response = await fetch(pictureObject.uri);
      const imageBlob = await response.blob();
      await uploadBytes(currentPhotoRef, imageBlob);
      const downloadURL = await getDownloadURL(currentPhotoRef);

      // Update the specific workout document with the image URI
      const currentWorkoutKey = getState().workoutsSlice.currentEditingWorkoutKey;
      if (!currentWorkoutKey) throw new Error("No workout specified.");

      const workoutRef = doc(db, 'workouts', currentWorkoutKey);
      await updateDoc(workoutRef, { image: downloadURL });

      return downloadURL;
    } catch (e) {
      console.error('Error saving picture:', e);
    }
  }
);


// Image Storage Slice
export const imageStorageSlice = createSlice({
  name: "imageStorage",
  initialState: {
    picture: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(setPicture.fulfilled, (state, action) => {
      state.picture = action.payload;
    });
  },
});

export default imageStorageSlice.reducer;

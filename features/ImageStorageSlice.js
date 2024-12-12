import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "../Secrets";

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

// Upload image and update user gallery
export const setPicture = createAsyncThunk(
  'imageStorage/setPicture',
  async (pictureObject, { getState }) => {
    const fileName = pictureObject.uri.split('/').pop();
    const currentPhotoRef = ref(storage, `images/${fileName}`);
    try {
      const response = await fetch(pictureObject.uri);
      const imageBlob = await response.blob();
      await uploadBytes(currentPhotoRef, imageBlob);

      const downloadURL = await getDownloadURL(currentPhotoRef);
      const currentUser = getState().auth.currentUser;

      const newPicture = {
        ...pictureObject,
        uri: downloadURL
      };
      const newGallery = currentUser?.gallery
        ? currentUser.gallery.concat(newPicture)
        : [newPicture];

      await updateDoc(doc(db, 'users', currentUser.key), { gallery: newGallery });
      return downloadURL;
    } catch (e) {
      console.error("Error saving picture:", e);
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

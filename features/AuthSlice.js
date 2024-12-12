import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import { setDoc, doc, getFirestore, collection, onSnapshot, getDoc } from 'firebase/firestore';
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

// Subscribe to user updates
export const subscribeToUserUpdates = (dispatch) => {
  let snapshotUnsubscribe = undefined;
  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }

  snapshotUnsubscribe = onSnapshot(collection(db, 'users'), usersSnapshot => {
    const updatedUsers = usersSnapshot.docs.map(uSnap => {
      return uSnap.data();
    });
    dispatch(loadUsers(updatedUsers));
  });
};

// Add a new user
export const addUser = createAsyncThunk(
  "auth/addUser",
  async (user) => {
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid,
    };
    await setDoc(doc(db, "users", user.uid), userToAdd);
    return userToAdd;
  }
);

// Load all users
export const loadUsers = createAsyncThunk("auth/loadUsers", async (users) => {
  return [...users];
});

// Set current user details
export const setUser = createAsyncThunk(
  'auth/setUser',
  async (authUser) => {
    const userSnap = await getDoc(doc(db, 'users', authUser.uid));
    const user = userSnap.data();
    return user;
  }
);

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [],
    currentUser: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users = [...state.users, action.payload];
    });

    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    builder.addCase(setUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export default authSlice.reducer;

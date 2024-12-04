// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { initializeApp, getApps, deleteApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   doc,
//   getDocs,
//   updateDoc,
//   addDoc,
//   deleteDoc,
//   writeBatch,
// } from "firebase/firestore";
// import { firebaseConfig } from "../Secrets";

// let app;
// const apps = getApps();
// if (apps.length == 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = apps[0];
// }
// const db = getFirestore(app);

// export const fetchGoal = createAsyncThunk("goal/fetchGoal", async () => {
//     try {
//       const groups = [];
//       const collRef = collection(db, "groups");
//       const q = query(collRef);
//       const querySnapshot = await getDocs(q);
//       querySnapshot.docs.forEach((docSnapshot) => {
//         const group = docSnapshot.data();
//         group.key = docSnapshot.id;
//         groups.push(group);
//       });
//       return groups;
//     } catch (error) {
//       throw error;
//     }
//   });

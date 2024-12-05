import { configureStore } from "@reduxjs/toolkit";
import workouts from "../features/workoutsSlice";
import AuthSlice from "../features/AuthSlice";
import user from "../features/userSlice";

export default configureStore({
  reducer: {
    workouts,
    AuthSlice,
    user,
  },
});

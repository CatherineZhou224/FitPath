import {configureStore} from "@reduxjs/toolkit";
import workouts from "../features/workoutsSlice";
import AuthSlice from "../features/AuthSlice";

export default configureStore({
  reducer: {
    workouts,
    AuthSlice,
  },
})
import { configureStore } from "@reduxjs/toolkit";
import workouts from "../features/workoutsSlice";
import AuthSlice from "../features/AuthSlice";
import image from "../features/ImageStorageSlice";
import goal from "../features/goalSlice";

export default configureStore({
  reducer: {
    workouts,
    image,
    AuthSlice,
    goal,
  },
});

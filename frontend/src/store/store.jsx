import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "../reducers/login.reducer";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

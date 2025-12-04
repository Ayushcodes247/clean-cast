import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "../reducers/login.reducer";
import { registerReducer } from "../reducers/register.reducer";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register : registerReducer
  },
});

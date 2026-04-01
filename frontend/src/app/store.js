import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../Features/auth/authApi";
import authReducer from "../Features/auth/authSlice";
import userReducer from "../Features/user/userSlice";
import { userProfileApi } from "../Features/user/userProfileApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,

    auth: authReducer,
    userProfile: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userProfileApi.middleware),
});

export default store;

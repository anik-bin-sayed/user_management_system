import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  setAuthMarker,
  clearAuthState,
  isAuthCookieValid,
} from "./authPersist";

const initialState = {
  user: null,
  isAuthenticated: isAuthCookieValid(),
  isSuccess: null,
  isError: null,
  isLoading: false,
  tokenRefreshScheduled: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      state.isSuccess = true;
      state.isError = null;
      state.isLoading = false;
      setAuthMarker();
    },

    setAuth: (state) => {
      state.isAuthenticated = true;
      // Set auth marker cookie (non-sensitive)
      setAuthMarker();
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSuccess = null;
      state.isError = null;
      state.isLoading = false;
      state.tokenRefreshScheduled = false;
      // Clear all persistence
      clearAuthState();
    },

    setTokenRefreshScheduled: (state, action) => {
      state.tokenRefreshScheduled = action.payload;
    },
  },
});

export const { setCredentials, setAuth, logoutUser, setTokenRefreshScheduled } =
  authSlice.actions;
export default authSlice.reducer;

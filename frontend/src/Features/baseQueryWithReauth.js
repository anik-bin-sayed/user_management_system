import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "./auth/authSlice";
import { API_BASE_URL } from "../config/constants";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const notifyRefreshTokenCompletion = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors - token might be expired
  if (result?.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResult = await baseQuery(
          { url: "accounts/refresh/", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          isRefreshing = false;
          notifyRefreshTokenCompletion();

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          isRefreshing = false;
          refreshSubscribers = [];

          // User needs to log in again
          api.dispatch(logoutUser());

          // Notify logout endpoint
          try {
            await baseQuery(
              { url: "accounts/logout/", method: "POST" },
              api,
              extraOptions,
            );
          } catch (err) {
            // Logout error
          }
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        api.dispatch(logoutUser());
      }
    } else {
      // Token refresh is in progress, queue this request
      return new Promise((resolve) => {
        subscribeToTokenRefresh(() => {
          resolve(baseQuery(args, api, extraOptions));
        });
      });
    }
  }

  return result;
};

export default baseQueryWithReauth;

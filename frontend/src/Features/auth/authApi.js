import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQueryWithReauth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "accounts/register/",
        method: "POST",
        body: data,
      }),
    }),

    verifyUser: builder.mutation({
      query: (token) => ({
        url: `accounts/verify-email/${token}/`,
        method: "GET",
      }),
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "accounts/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    twoFactorLogin: builder.mutation({
      query: ({ user_id, code }) => ({
        url: "accounts/two-factor/verify-login/",
        method: "POST",
        body: { user_id, code },
      }),
    }),

    setupTwoFactor: builder.mutation({
      query: ({ password }) => ({
        url: "accounts/two-factor/setup/",
        method: "POST",
        body: { password },
      }),
    }),

    verifyTwoFactor: builder.mutation({
      query: ({ code }) => ({
        url: "/accounts/two-factor/verify/",
        method: "POST",
        body: { code },
      }),
    }),

    disableTwoFactor: builder.mutation({
      query: ({ password }) => ({
        url: "/accounts/two-factor/disable/",
        method: "POST",
        body: { password },
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "accounts/refresh/",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
          }
        } catch (error) {
          // Handle refresh token error
        }
      },
    }),

    userLoggedOut: builder.mutation({
      query: (data) => ({
        url: "accounts/logout/",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "accounts/change-password/",
        method: "POST",
        body: data,
      }),
    }),

    forgetPassword: builder.mutation({
      query: ({ email }) => ({
        url: "accounts/password-reset/",
        method: "POST",
        body: { email },
      }),
    }),

    verifyToken: builder.mutation({
      query: ({ uid, token }) => ({
        url: `accounts/password-reset-verify/${uid}/${token}/`,
        method: "GET",
      }),
    }),

    setNewPassword: builder.mutation({
      query: ({ password, uid, token }) => ({
        url: `accounts/password-reset-confirm/${uid}/${token}/`,
        method: "POST",
        body: { password },
      }),
    }),

    deleteAccount: builder.mutation({
      query: ({ password }) => ({
        url: "accounts/delete/",
        method: "delete",
        body: { password },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyUserMutation,
  useLoginUserMutation,
  useTwoFactorLoginMutation,
  useSetupTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
  useRefreshTokenMutation,
  useUserLoggedOutMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useForgetPasswordMutation,
  useVerifyTokenMutation,
  useSetNewPasswordMutation,
} = authApi;

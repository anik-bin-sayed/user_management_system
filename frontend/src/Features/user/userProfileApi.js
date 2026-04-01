import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQueryWithReauth";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: "profile/",
        method: "GET",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "profile/",
        method: "PATCH",
        body: data,
      }),
    }),

    uploadProfileImage: builder.mutation({
      query: (data) => ({
        url: "profile/upload-photo/",
        method: "POST",
        body: data,
      }),
    }),

    currentProfileImage: builder.query({
      query: () => ({
        url: "profile/current-photo/",
        method: "GET",
      }),
    }),

    galleryImages: builder.query({
      query: (page = 1) => ({
        url: `profile/gallery/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Images"],
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `profile/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),

    makeProfilePhoto: builder.mutation({
      query: (id) => ({
        url: `profile/make-profile-photo/${id}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,
  useCurrentProfileImageQuery,
  useGalleryImagesQuery,
  useDeleteImageMutation,
  useMakeProfilePhotoMutation,
} = userProfileApi;

import { createSlice } from "@reduxjs/toolkit";

import { setAuthMarker } from "../auth/authPersist";

const initialState = {
  user: null,
  currentImage: null,
  galleryImages: [],
  isLoading: true,
};

const userSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      setAuthMarker();
    },

    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
      state.isLoading = false;
      setAuthMarker();
    },

    setGalleryImages: (state, action) => {
      state.galleryImages = action.payload;
      state.isLoading = false;
      setAuthMarker();
    },
  },
});

export const { setUser, setCurrentImage, setGalleryImages } = userSlice.actions;
export default userSlice.reducer;

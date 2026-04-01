import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));
const EmailVerify = lazy(() => import("../Pages/Auth/EmailVerify"));
const VerifyLogin = lazy(() => import("../Pages/Auth/VerifyLogin"));

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import { useRefreshTokenMutation } from "../Features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Features/auth/authSlice";

import {
  isAuthCookieValid,
  startTokenRefreshTimer,
  stopTokenRefreshTimer,
} from "../Features/auth/authPersist";

import {
  useCurrentProfileImageQuery,
  useGalleryImagesQuery,
  useUserProfileQuery,
} from "../Features/user/userProfileApi";
import {
  setCurrentImage,
  setGalleryImages,
  setUser,
} from "../Features/user/userSlice";
import Loader from "../Components/Loader";

const ShowAllDetails = lazy(
  () => import("../Components/ShowAllDetails/ShowAllDetails"),
);

const Index = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [refreshToken] = useRefreshTokenMutation();

  const { data, error, isLoading } = useUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: profileCurrentImage, isLoading: isProfileImageLoading } =
    useCurrentProfileImageQuery(undefined, {
      skip: !isAuthenticated,
    });

  const { data: galleryImages, isLoading: isGalleryImagesLoading } =
    useGalleryImagesQuery(undefined, {
      skip: !isAuthenticated,
    });

  useEffect(() => {
    if (galleryImages) {
      dispatch(setGalleryImages(galleryImages));
    }
  }, [galleryImages, dispatch]);

  useEffect(() => {
    if (profileCurrentImage?.image) {
      dispatch(setCurrentImage(profileCurrentImage.image));
    }
  }, [profileCurrentImage, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      startTokenRefreshTimer(
        () => refreshToken(),
        () => ({ auth: { isAuthenticated } }),
      );
    } else {
      stopTokenRefreshTimer();
    }

    return () => stopTokenRefreshTimer();
  }, [isAuthenticated, refreshToken]);

  useEffect(() => {
    if (isAuthenticated && !isAuthCookieValid()) {
      dispatch(logoutUser());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (data?.user) {
      const mergedData = {
        ...data,
        ...data.user,
      };

      delete mergedData.user;

      dispatch(setUser(mergedData));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error?.status === 401 || error?.status === 403) {
      dispatch(logoutUser());
    }
  }, [error, dispatch]);

  if (isLoading || isProfileImageLoading || isGalleryImagesLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PublicRoute restricted={false} />}>
          <Route path="/verify-email/:token/" element={<EmailVerify />} />
          <Route path="/two-factor-verify" element={<VerifyLogin />} />
        </Route>

        {/* Protected Routes with Suspense */}
        <Route
          element={
            <Suspense fallback={<Loader />}>
              <ProtectedRoute />
            </Suspense>
          }
        >
          <Route path="/" element={<ShowAllDetails />} />
          <Route path="/:info" element={<ShowAllDetails />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default Index;

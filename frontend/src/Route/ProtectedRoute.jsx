import React, { useEffect } from "react";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { setAuth } from "../Features/auth/authSlice";
import { useUserProfileQuery } from "../Features/user/userProfileApi";
import { setUser } from "../Features/user/userSlice";
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data } = useUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      const mergedData = {
        ...data,
        ...data.user,
      };
      delete mergedData.user;
      dispatch(setUser(mergedData));
      dispatch(setAuth(mergedData));
    }
  }, [data, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

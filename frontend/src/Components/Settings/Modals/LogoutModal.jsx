import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";

import { useUserLoggedOutMutation } from "../../../Features/auth/authApi";
import { logoutUser } from "../../../Features/auth/authSlice";
import { showErrorToast } from "../../../utils/showErrorToast";

const LogoutModal = ({ closeModal }) => {
  const [animate, setAnimate] = useState(false);

  const dispatch = useDispatch();

  const [userLoggedOut, { isLoading }] = useUserLoggedOutMutation();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);

    setTimeout(() => {
      closeModal && closeModal();
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await userLoggedOut().unwrap();
      dispatch(logoutUser());
      toast.success("Logged out successfully");
      handleClose();
    } catch (error) {
      showErrorToast(error);
    }
    handleClose();
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div
        className={`bg-white w-full max-w-md rounded-xl shadow-lg p-6 transform transition-all duration-300 ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          Confirm Logout
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex items-center justify-evenly gap-6">
          <button
            onClick={handleClose}
            className="px-4 py-2  bg-gray-200 text-black rounded-md hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 outline bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled: cursor-not-allowed"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(LogoutModal);

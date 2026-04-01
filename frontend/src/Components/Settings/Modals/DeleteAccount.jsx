import React, { memo, useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch } from "react-redux";

import { useDeleteAccountMutation } from "../../../Features/auth/authApi";
import { logoutUser } from "../../../Features/auth/authSlice";
import { showErrorToast } from "../../../utils/showErrorToast";
import { showSuccessToast } from "../../../utils/showSuccessToast";

const DeleteAccount = ({ closeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);

    setTimeout(() => {
      closeModal && closeModal();
    }, 300);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    setError("");

    if (!password) {
      return setError("Please enter your password to delete the account");
    }
    try {
      const res = await deleteAccount({ password }).unwrap();
      dispatch(logoutUser());
      showSuccessToast(res?.data?.message || "Account deleted successfully!");
      handleClose();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white w-full max-w-md rounded-xl shadow-lg p-6 transform transition-all duration-300 ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold text-red-600 text-center mb-4">
          Delete Account
        </h2>

        <p className="text-sm text-gray-600 mb-5 text-center">
          This action cannot be undone. Deleting your account will permanently
          remove all your data.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleDelete}>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded outline-none ring-2 ring-red-500 focus:ring-red-700"
          />

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <div className="relative group">
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-red-600 text-white py-2 rounded-md 
               hover:bg-red-700 transition 
               cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting" : "Permanently Delete Account"}
            </button>

            {!password && (
              <span
                className="absolute -top-6 left-1/2 -translate-x-1/2 
                     bg-black text-white text-xs px-2 py-1 rounded 
                     opacity-0 group-hover:opacity-100 
                     transition-all pointer-events-none whitespace-nowrap"
              >
                Please enter password to enable this button
              </span>
            )}
          </div>
        </form>

        <button
          onClick={handleClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full cursor-pointer border border-gray-300 rounded-md py-2 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default memo(DeleteAccount);

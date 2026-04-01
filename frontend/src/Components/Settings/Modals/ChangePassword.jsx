import React, { memo, useEffect, useState } from "react";

import { useChangePasswordMutation } from "../../../Features/auth/authApi";
import { showErrorToast } from "../../../utils/showErrorToast";
import { showSuccessToast } from "../../../utils/showSuccessToast";

const ChangePassword = ({ closeModal }) => {
  const [animate, setAnimate] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [formdata, setFormData] = useState({
    old_password: "",
    new_password: "",
  });

  const [error, setError] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);

    setTimeout(() => {
      closeModal();
    }, 600);
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(formdata.new_password);

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const resetForm = () => {
    setFormData({
      old_password: "",
      new_password: "",
    });
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formdata.new_password) {
      return setError("Old password is required");
    }

    if (formdata.new_password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (formdata.new_password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await changePassword({
        old_password: formdata.old_password,
        new_password: formdata.new_password,
      }).unwrap();
      showSuccessToast("Password changed successfully!");
      resetForm();
      handleClose();
    } catch (error) {
      showErrorToast(error);
      resetForm();
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white w-full max-w-md rounded-xl shadow-lg p-6 transform transition-all duration-300 ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-6 text-center">Change Password</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={formdata.old_password}
            onChange={(e) =>
              setFormData({ ...formdata, old_password: e.target.value })
            }
            className="border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <input
              type="password"
              placeholder="New Password"
              value={formdata.new_password}
              onChange={(e) =>
                setFormData({ ...formdata, new_password: e.target.value })
              }
              className="border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />

            {formdata.new_password && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded transition-all ${
                      strengthColor[strength - 1] || "bg-gray-300"
                    }`}
                    style={{ width: `${strength * 25}%` }}
                  />
                </div>

                <p className="text-xs mt-1 text-gray-500">
                  Strength: {strengthLabel[strength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <button
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
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

export default memo(ChangePassword);

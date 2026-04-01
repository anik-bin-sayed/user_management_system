import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiArrowNarrowRight,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useLoginUserMutation } from "../../Features/auth/authApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAuth } from "../../Features/auth/authSlice";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await loginUser(formData).unwrap();
      if (response.two_factor_enabled) {
        navigate("/two-factor-verify", {
          state: { email: response.email, user_id: response.user_id },
        });
        toast.info(response.detail || "Two-factor verification required");
      } else {
        dispatch(setAuth());
        toast.success("Login successful!");
        navigate("/home");
      }
      setFormData(initialState);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleGoogleProvider = () => {
    window.location.href = "http://localhost:8000/accounts/google/login/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 px-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <HiLockClosed className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 pr-12 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                />
                <HiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forget-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-sm text-gray-400 font-medium">OR</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleProvider}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl px-4 py-3 bg-white hover:bg-gray-50 transition duration-200 shadow-sm cursor-pointer group"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900">
              Continue with Google
            </span>
          </button>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                Register <HiArrowNarrowRight className="text-sm" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles (add to your global CSS or use Tailwind plugin) */}
    </div>
  );
};

export default Login;

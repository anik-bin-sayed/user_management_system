import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTwoFactorLoginMutation } from "../../Features/auth/authApi";
import { toast } from "react-toastify";
import { showErrorToast } from "../../utils/showErrorToast";
import { setAuth } from "../../Features/auth/authSlice";
import { useDispatch } from "react-redux";

const VerifyLogin = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);

  const { state } = useLocation();
  const navigate = useNavigate();

  const user_id = state?.user_id || "";
  const email = state?.email || "";

  const dispatch = useDispatch();

  const [twoFactorLogin, { isLoading }] = useTwoFactorLoginMutation();

  useEffect(() => {
    if (!email || !user_id) {
      navigate("/login");
    }
  }, [email, user_id, navigate]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputs.current[index + 1].focus();

    if (newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (code) => {
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      await twoFactorLogin({ user_id, code }).unwrap();
      toast.success("Login successful!");
      dispatch(setAuth());
      setOtp(new Array(6).fill(""));
      navigate("/");
    } catch (error) {
      showErrorToast(error);
      setOtp(new Array(6).fill(""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Two Factor Verification
        </h2>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code from your authenticator app
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`OTP digit ${index + 1}`}
              className="w-12 h-12 text-xl text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleSubmit(otp.join(""))}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading && (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyLogin;

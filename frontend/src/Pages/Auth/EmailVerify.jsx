import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyUserMutation } from "../../Features/auth/authApi";

const EmailVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [verifyUser] = useVerifyUserMutation();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await verifyUser(token).unwrap();

        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
      }
    };

    if (token) verifyEmail();
  }, [token, verifyUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"></div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>

            <p className="text-gray-500 mt-2">
              Please wait while we verify your account
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>

            <h2 className="text-xl font-semibold text-gray-800">
              Email Verified Successfully
            </h2>

            <p className="text-gray-500 mt-2">Redirecting to login page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-4">✕</div>

            <h2 className="text-xl font-semibold text-gray-800">
              Verification Failed
            </h2>

            <p className="text-gray-500 mt-2">Token expired or invalid</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;

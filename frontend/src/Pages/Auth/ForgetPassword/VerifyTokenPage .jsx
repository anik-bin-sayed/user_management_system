import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyTokenMutation } from "../../../Features/auth/authApi";
import { showErrorToast } from "../../../utils/showErrorToast";

const VerifyTokenPage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  const [verifyToken] = useVerifyTokenMutation();

  useEffect(() => {
    const verifiedToken = async () => {
      try {
        await verifyToken({ uid, token }).unwrap();
        setTimeout(() => {
          navigate(`/new-password/${uid}/${token}`);
        }, 2000);
        setStatus("valid");
      } catch (error) {
        showErrorToast(error);
        setStatus("invalid");
      }
    };

    verifiedToken();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-700 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-xl font-semibold text-gray-700">
              Verifying link...
            </h1>
          </>
        )}
        {status === "valid" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-xl font-semibold text-green-600">
              Link verified! Redirecting...
            </h1>
          </>
        )}
        {status === "invalid" && (
          <>
            <div className="flex justify-center mb-4"></div>
            <div className="flex justify-center mb-4"> X</div>
            <h1 className="text-xl font-semibold text-red-600">
              Invalid or expired link
            </h1>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyTokenPage;

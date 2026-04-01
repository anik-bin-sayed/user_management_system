import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  HiShieldCheck,
  HiKey,
  HiQrcode,
  HiX,
  HiLockClosed,
  HiRefresh,
  HiClipboardCopy,
} from "react-icons/hi";
import { setUser } from "../../../Features/user/userSlice";
import {
  useDisableTwoFactorMutation,
  useSetupTwoFactorMutation,
  useVerifyTwoFactorMutation,
} from "../../../Features/auth/authApi";
import { showErrorToast } from "../../../utils/showErrorToast";
import { showSuccessToast } from "../../../utils/showSuccessToast";

const TwoFactor = ({ closeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("enter");
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const { user } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  const [setupTwoFactor, { isLoading: isSetupLoading }] =
    useSetupTwoFactorMutation();
  const [verifyTwoFactor, { isLoading: verifyLoading }] =
    useVerifyTwoFactorMutation();
  const [disableTwoFactor, { isLoading: disabledLoading }] =
    useDisableTwoFactorMutation();

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Auto-submit when code reaches 6 digits
  useEffect(() => {
    if (stage === "verify" && code.length === 6 && !verifyLoading) {
      handleVerify();
    }
  }, [code, stage, verifyLoading]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  const handleEnable = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    try {
      const res = await setupTwoFactor({ password }).unwrap();
      const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?data=" +
        encodeURIComponent(res.otp_auth_url);
      setSecret(res.secret);
      setQrCode(qrUrl);
      setPassword("");
      setStage("verify");
    } catch (err) {
      toast.error(err.data?.error || "Failed to enable 2FA");
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    try {
      await verifyTwoFactor({ code }).unwrap();
      dispatch(
        setUser({
          ...user,
          account_info: {
            ...user?.account_info,
            two_factor_enabled: true,
          },
        }),
      );
      showSuccessToast("Two Factor Authentication Enabled Successfully!");
      setCode("");
      setPassword("");
      setSecret("");
      setQrCode(null);
      setStage("enter");
      closeModal();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    try {
      await disableTwoFactor({ password }).unwrap();
      dispatch(
        setUser({
          ...user,
          account_info: {
            ...user?.account_info,
            two_factor_enabled: false,
          },
        }),
      );
      showSuccessToast("Two Factor Authentication Disabled!");
      setPassword("");
      closeModal();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Secret key copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`custom-scroll bg-white/95 backdrop-blur-sm w-full max-w-md  shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          animate ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* Header with gradient accent */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 ">
          <div className="relative p-6 border-b border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 " />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                  <HiShieldCheck className="text-2xl text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Two-Factor Authentication
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {user?.account_info?.two_factor_enabled ? (
            <form onSubmit={handleDisable} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <HiLockClosed className="text-3xl text-red-600" />
                </div>
                <p className="text-gray-600 text-sm">
                  2FA is currently{" "}
                  <span className="font-semibold text-green-600">enabled</span>.
                  Enter your password to disable it.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={disabledLoading || !password}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {disabledLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <HiRefresh className="animate-spin" />
                    Disabling...
                  </div>
                ) : (
                  "Disable 2FA"
                )}
              </button>
            </form>
          ) : (
            <>
              {stage === "enter" && (
                <form onSubmit={handleEnable} className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      <HiKey className="text-3xl text-indigo-600" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Enhance your account security by enabling two-factor
                      authentication. Enter your password to continue.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSetupLoading || !password}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                  >
                    {isSetupLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <HiRefresh className="animate-spin" />
                        Setting up...
                      </div>
                    ) : (
                      "Enable Two-Factor Authentication"
                    )}
                  </button>
                </form>
              )}

              {stage === "verify" && qrCode && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <HiQrcode className="text-2xl text-green-600" />
                    </div>
                    <p className="text-gray-700 font-medium">Scan QR Code</p>
                    <p className="text-gray-500 text-xs">
                      Use Google Authenticator or any TOTP app
                    </p>
                  </div>

                  {/* QR Code - Fixed size and responsive */}
                  <div className="bg-gray-50 p-3 rounded-xl flex justify-center">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-32 h-32 object-contain"
                    />
                  </div>

                  {/* Secret Key - with copy and wrap */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1 text-center">
                      Secret Key (if scanning fails)
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <code className="text-sm font-mono bg-white px-3 py-1 rounded border break-all text-center flex-1">
                        {secret}
                      </code>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition"
                        title="Copy secret key"
                      >
                        <HiClipboardCopy size={18} />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-600 text-center mt-1">
                        Copied!
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      value={code}
                      onChange={handleCodeChange}
                      className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      maxLength={6}
                      autoFocus
                    />
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      {code.length === 6
                        ? "✓ Verifying automatically..."
                        : "Enter 6-digit code"}
                    </p>
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={verifyLoading || code.length !== 6}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                  >
                    {verifyLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <HiRefresh className="animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Enable"
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleClose}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TwoFactor);

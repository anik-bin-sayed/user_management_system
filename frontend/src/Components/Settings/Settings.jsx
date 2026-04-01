import React, { useState } from "react";
import TwoFactor from "./Modals/TwoFactor";
import DeleteAccount from "./Modals/DeleteAccount";
import ChangePassword from "./Modals/ChangePassword";
import LogoutModal from "./Modals/LogoutModal";
import { useSelector } from "react-redux";
import {
  Cog6ToothIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const { account_info } = useSelector((state) => state.userProfile?.user);
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  // Define action items
  const actions = [
    {
      id: "password",
      label: "Change Password",
      icon: KeyIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-100",
    },
    {
      id: "2fa",
      label: account_info?.two_factor_enabled ? "Disable 2FA" : "Enable 2FA",
      icon: ShieldCheckIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-100",
    },
    {
      id: "delete",
      label: "Delete Account",
      icon: TrashIcon,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
      borderColor: "border-red-100",
    },
    {
      id: "logout",
      label: "Logout",
      icon: ArrowRightOnRectangleIcon,
      color: "text-white",
      bgColor: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Cog6ToothIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Account Settings</h2>
      </div>

      {/* Actions List */}
      <div className="p-6 space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setActiveModal(action.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${action.bgColor} ${action.borderColor} hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${action.color}`} />
                <span className={`font-medium ${action.color}`}>
                  {action.label}
                </span>
              </div>
              {/* Optional chevron to indicate clickability */}
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Footer with last updated or account status */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
        Manage your account security and preferences
      </div>

      {/* Modals */}
      {activeModal === "password" && <ChangePassword closeModal={closeModal} />}
      {activeModal === "2fa" && <TwoFactor closeModal={closeModal} />}
      {activeModal === "delete" && <DeleteAccount closeModal={closeModal} />}
      {activeModal === "logout" && <LogoutModal closeModal={closeModal} />}
    </div>
  );
};

export default Settings;

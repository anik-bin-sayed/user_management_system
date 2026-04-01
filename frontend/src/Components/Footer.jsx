import React from "react";
import {
  CheckCircleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CalendarIcon,
  LanguageIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const AccountOverview = React.memo(({ account_info, preferences }) => {
  const displayValue = (value) => value || "-";

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const accountFields = [
    {
      icon: CheckCircleIcon,
      label: "Verified",
      value: account_info?.is_verified ? "Yes" : "No",
      color: account_info?.is_verified ? "text-green-600" : "text-gray-500",
    },
    {
      icon: LockClosedIcon,
      label: "Account Locked",
      value: account_info?.is_locked ? "Yes" : "No",
      color: account_info?.is_locked ? "text-red-600" : "text-gray-500",
    },
    {
      icon: ShieldCheckIcon,
      label: "Two Factor",
      value: account_info?.two_factor_enabled ? "Enabled" : "Disabled",
      color: account_info?.two_factor_enabled
        ? "text-green-600"
        : "text-gray-500",
    },
    {
      icon: CalendarIcon,
      label: "Created",
      value: formatDate(account_info?.created_at),
    },
  ];

  const preferenceFields = [
    {
      icon: LanguageIcon,
      label: "Language",
      value: preferences?.language_preference || "-",
    },
    {
      icon: SunIcon,
      label: "Dark Mode",
      value: preferences?.dark_mode_enabled ? "Enabled" : "Disabled",
      color: preferences?.dark_mode_enabled
        ? "text-yellow-600"
        : "text-gray-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Account Overview</h2>
      </div> */}

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Account Information
            </h3>
            <div className="space-y-3">
              {accountFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Icon
                        className={`w-5 h-5 ${field.color || "text-blue-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {field.label}
                      </p>
                      <p className="text-base text-gray-800 font-semibold truncate">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Preferences
            </h3>
            <div className="space-y-3">
              {preferenceFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Icon
                        className={`w-5 h-5 ${field.color || "text-blue-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {field.label}
                      </p>
                      <p className="text-base text-gray-800 font-semibold truncate">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with note */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
        Account status and preferences
      </div>
    </div>
  );
});

AccountOverview.displayName = "AccountOverview";

export default AccountOverview;

import React, { memo } from "react";
import {
  GlobeAltIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  XMarkIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const Social = memo(({ social_links, setUpdate }) => {
  const displayValue = (value) => value || "-";

  const fields = [
    { icon: GlobeAltIcon, label: "Website", value: social_links?.website },
    { icon: CodeBracketIcon, label: "GitHub", value: social_links?.github },
    { icon: BriefcaseIcon, label: "LinkedIn", value: social_links?.linkedin },
    { icon: XMarkIcon, label: "Twitter", value: social_links?.twitter },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShareIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Social Links</h2>
        </div>
        <button
          onClick={() => setUpdate("social")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium shadow-md"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Edit
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            const value = field.value;
            const isUrl = value && value.startsWith("http");
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {field.label}
                  </p>
                  {isUrl ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 hover:underline font-semibold truncate block"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-base text-gray-800 font-semibold truncate">
                      {displayValue(value)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </span>
          <span className="text-gray-400">
            {fields.filter((f) => f.value).length} links
          </span>
        </div>
      </div>
    </div>
  );
});

Social.displayName = "Social";

export default Social;

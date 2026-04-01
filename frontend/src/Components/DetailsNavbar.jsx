import React from "react";

import { GoFileMedia } from "react-icons/go";
import {
  IoSettingsOutline,
  IoShareSocialOutline,
  IoHomeOutline,
  IoPersonOutline,
  IoCallOutline,
  IoBriefcaseOutline,
} from "react-icons/io5";

import { Link } from "react-router-dom";

const DetailsNavbar = React.memo(({ activeTab }) => {
  const tabs = [
    { id: "home", label: "Home", icon: IoHomeOutline, link: "/" },
    {
      id: "personal",
      label: "Personal Info",
      icon: IoPersonOutline,
      link: "/personal",
    },
    {
      id: "contact",
      label: "Contact Info",
      icon: IoCallOutline,
      link: "/contact",
    },
    {
      id: "professional",
      label: "Professional Info",
      icon: IoBriefcaseOutline,
      link: "/professional",
    },
    {
      id: "social",
      label: "Social Info",
      icon: IoShareSocialOutline,
      link: "/social",
    },
    {
      id: "settings",
      label: "Settings",
      icon: IoSettingsOutline,
      link: "/settings",
    },
    {
      id: "media",
      label: "Media",
      icon: GoFileMedia,
      link: "/media",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm border">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between  md:justify-start sm:gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Link
                key={tab.id}
                to={tab.link}
                className={`
                  flex items-center justify-between gap-1 sm:gap-2 py-2 px-3 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

DetailsNavbar.displayName = "DetailsNavbar";

export default DetailsNavbar;

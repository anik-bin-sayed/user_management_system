import React, { useState, memo } from "react";

import defaultImg from "../../../../assets/image/default.png";
import {
  UserIcon,
  AtSymbolIcon,
  EnvelopeIcon,
  CalendarIcon,
  IdentificationIcon,
  MapPinIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  LanguageIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import ImageModal from "../../../Home/ImageModal";

const Personal = memo(({ personal_info, setUpdate }) => {
  const { currentImage } = useSelector((state) => state.userProfile);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const displayValue = (value) => value || "-";
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  const sections = [
    {
      title: "Basic Information",
      fields: [
        { icon: UserIcon, label: "Full Name", value: personal_info?.full_name },
        {
          icon: AtSymbolIcon,
          label: "Username",
          value: personal_info?.username,
        },
        { icon: EnvelopeIcon, label: "Email", value: personal_info?.email },
        {
          icon: CalendarIcon,
          label: "Birthdate",
          value: personal_info?.birthdate,
        },
        {
          icon: IdentificationIcon,
          label: "Gender",
          value: capitalize(personal_info?.gender),
        },
        {
          icon: IdentificationIcon,
          label: "Marital info",
          value: capitalize(personal_info?.marital_status),
        },
      ],
    },
    {
      title: "Location & Contact",
      fields: [
        { icon: MapPinIcon, label: "City", value: personal_info?.city },
        { icon: GlobeAltIcon, label: "Country", value: personal_info?.country },
        {
          icon: HomeModernIcon,
          label: "Zip Code",
          value: personal_info?.zip_code,
        },
        {
          icon: LanguageIcon,
          label: "Language",
          value: personal_info?.language,
        },
      ],
    },
    {
      title: "About Me",
      fields: [
        {
          icon: ChatBubbleBottomCenterTextIcon,
          label: "Bio",
          value: personal_info?.bio,
          fullWidth: true,
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Personal Information
          </h2>
        </div>
        <button
          onClick={() => setUpdate("personal")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium shadow-md"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Edit Profile
        </button>
      </div>

      {/* Profile Avatar Placeholder */}
      <div className="px-6 pt-6 pb-2 flex items-center space-x-4">
        <div
          onClick={() => setOpenModal(true)}
          className="cursor-pointer group relative "
        >
          <img
            src={currentImage || defaultImg}
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-all">
            Change Photo
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {personal_info?.full_name || "User"}
          </h3>
          <p className="text-gray-500">
            @{personal_info?.username || "username"}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, index) => {
                const Icon = field.icon;
                const isFullWidth = field.fullWidth;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors ${
                      isFullWidth ? "md:col-span-2" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {field.label}
                      </p>
                      <p
                        className={`text-base text-gray-800 font-medium ${
                          isFullWidth
                            ? "whitespace-normal break-words"
                            : "truncate"
                        }`}
                      >
                        {displayValue(field.value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with last updated */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm">
        <span className="text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>
      <ImageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
});

Personal.displayName = "Personal";

export default Personal;

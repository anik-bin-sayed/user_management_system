import React, { useState } from "react";
import { useSelector } from "react-redux";
import defaultImg from "../../assets/image/default.png";
import ImageModal from "./ImageModal";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const { user, currentImage, isLoading } = useSelector(
    (state) => state.userProfile,
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const joinDate = user?.account_info?.created_at
    ? new Date(user.account_info.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Profile Dashboard</h2>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
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

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl text-gray-900 mb-2">
              {user?.personal_info?.full_name || "User"}
            </h1>
            {user?.personal_info?.username && (
              <p className="text-gray-500 text-lg mb-3">
                @{user?.personal_info?.username}
              </p>
            )}
            <div className="space-y-2 text-gray-600">
              {user?.personal_info?.email && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span>{user.personal_info.email}</span>
                </div>
              )}
              {joinDate && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span>Joined {joinDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Manage your profile, account settings, and preferences from the
            sections below.
          </p>
        </div>
      </div>

      <ImageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default Home;

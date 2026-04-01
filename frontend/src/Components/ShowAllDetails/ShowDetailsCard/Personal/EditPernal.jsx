import React, { useState, useEffect, useRef } from "react";
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "../../../../Features/user/userProfileApi";
import { showErrorToast } from "../../../../utils/showErrorToast";
import { showSuccessToast } from "../../../../utils/showSuccessToast";
import { UserIcon } from "@heroicons/react/24/outline";

const initialState = {
  bio: "",
  birthdate: "",
  full_name: "",
  language: "",
  marital_status: "",
  username: "",
  gender: "",
  country: "",
  zip_code: "",
  city: "",
};

const EditPersonal = ({ personal_info, setUpdate }) => {
  const [personalInfo, setPersonalInfo] = useState(initialState);
  const isInitialMount = useRef(true);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { refetch } = useUserProfileQuery();

  useEffect(() => {
    if (personal_info && isInitialMount.current) {
      // Exclude 'image' from the data used to fill the form
      const { image, ...rest } = personal_info;
      setPersonalInfo((prev) => ({ ...prev, ...rest }));
      isInitialMount.current = false;
    }
  }, [personal_info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(personalInfo).unwrap();
      showSuccessToast("Personal information updated successfully!");
      setUpdate("");
      refetch();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Edit Personal Information
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setUpdate("")}
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={personalInfo.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="John Doe"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={personalInfo.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="@johndoe"
            />
          </div>

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={personalInfo.birthdate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={personalInfo.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label
              htmlFor="marital_status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Marital Status
            </label>
            <select
              id="marital_status"
              name="marital_status"
              value={personalInfo.marital_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={personalInfo.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="English, Bengali, etc."
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={personalInfo.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Your country"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={personalInfo.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Your city"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label
              htmlFor="zip_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={personalInfo.zip_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g. 10001"
            />
          </div>

          {/* Bio - full width */}
          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={personalInfo.bio}
              onChange={handleChange}
              className="w-full h-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Tell something about yourself..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setUpdate("")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPersonal;

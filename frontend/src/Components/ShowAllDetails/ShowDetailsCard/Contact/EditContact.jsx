import React, { useState, useEffect, useRef } from "react";
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "../../../../Features/user/userProfileApi";
import { showErrorToast } from "../../../../utils/showErrorToast";
import { showSuccessToast } from "../../../../utils/showSuccessToast";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const initialState = {
  email: "",
  alternate_email: "",
  phone: "",
  address: "",
  timezone: "",
};

const EditContact = ({ contact_info, setUpdate }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [contactInfo, setContactInfo] = useState(initialState);
  const isInitialMount = useRef(true);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { refetch } = useUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (contact_info && isInitialMount.current) {
      // Exclude any unwanted fields if necessary
      setContactInfo((prev) => ({ ...prev, ...contact_info }));
      isInitialMount.current = false;
    }
  }, [contact_info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      contact_info: contactInfo,
    };

    try {
      await updateUserProfile(payload).unwrap();
      showSuccessToast("Contact information updated successfully!");
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
            <EnvelopeIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Edit Contact Information
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
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="john@example.com"
            />
          </div>

          {/* Alternate Email */}
          <div>
            <label
              htmlFor="alternate_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alternate Email
            </label>
            <input
              type="email"
              id="alternate_email"
              name="alternate_email"
              value={contactInfo.alternate_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="alternate@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="+1 234 567 890"
            />
          </div>

          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={contactInfo.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select timezone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Europe/Paris">Central European Time (CET)</option>
              <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
              <option value="Asia/Dhaka">Bangladesh Standard Time (BST)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
              <option value="Australia/Sydney">
                Australian Eastern Time (AET)
              </option>
            </select>
          </div>

          {/* Address - full width */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="2"
              value={contactInfo.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="123 Main St, City, State, ZIP"
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

export default EditContact;

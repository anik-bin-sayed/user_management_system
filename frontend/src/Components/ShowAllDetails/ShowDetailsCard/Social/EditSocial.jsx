import React, { useState, useEffect, useRef } from "react";
import {
  useUpdateUserProfileMutation,
  useUserProfileQuery,
} from "../../../../Features/user/userProfileApi";
import { showErrorToast } from "../../../../utils/showErrorToast";
import { showSuccessToast } from "../../../../utils/showSuccessToast";
import { ShareIcon } from "@heroicons/react/24/outline";

const initialState = {
  website: "",
  github: "",
  linkedin: "",
  twitter: "",
};

const EditSocial = ({ social_links, setUpdate }) => {
  const [socialInfo, setSocialInfo] = useState(initialState);
  const isInitialMount = useRef(true);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { refetch } = useUserProfileQuery();

  useEffect(() => {
    if (social_links && isInitialMount.current) {
      setSocialInfo((prev) => ({ ...prev, ...social_links }));
      isInitialMount.current = false;
    }
  }, [social_links]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload – adjust the key to match your API
    const payload = {
      social_links: socialInfo,
    };

    try {
      await updateUserProfile(payload).unwrap();
      showSuccessToast("Social links updated successfully!");
      setUpdate("");
      refetch();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShareIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Edit Social Links
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

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={socialInfo.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GitHub
            </label>
            <input
              type="url"
              id="github"
              name="github"
              value={socialInfo.github}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={socialInfo.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={socialInfo.twitter}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

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

export default EditSocial;

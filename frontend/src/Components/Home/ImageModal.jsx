import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCurrentProfileImageQuery,
  useGalleryImagesQuery,
  useUploadProfileImageMutation,
} from "../../Features/user/userProfileApi";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";

const ImageModal = ({
  openModal,
  setOpenModal,
  selectedImage,
  setSelectedImage,
}) => {
  const [animate, setAnimate] = useState(false);

  const [file, setFile] = useState(null);

  const [uploadProfileImage, { isLoading: uploading }] =
    useUploadProfileImageMutation();
  const { refetch: currentProfileRefetch } = useCurrentProfileImageQuery();
  const { refetch: galleryRefetch } = useGalleryImagesQuery();

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setSelectedImage(URL.createObjectURL(selected));
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setOpenModal(false);
    }, 300);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image!");

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadProfileImage(formData).unwrap();
      showSuccessToast("Profile image updated successfully!");
      handleClose();
      galleryRefetch();
      currentProfileRefetch();
    } catch (err) {
      showErrorToast(err);
    }
  };

  return (
    openModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div
          className={`bg-white w-full max-w-md rounded-xl shadow-lg p-6 transform transition-all duration-300 ${
            animate ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Upload Profile Image
          </h2>

          {/* Preview */}
          {selectedImage && (
            <img
              src={selectedImage}
              className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4 border border-gray-300 p-2 rounded w-full cursor-pointer"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default memo(ImageModal);

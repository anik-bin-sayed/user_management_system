import React, { useState, memo } from "react";
import MediaImageModal from "./MediaImageModal";
import {
  useCurrentProfileImageQuery,
  useDeleteImageMutation,
  useMakeProfilePhotoMutation,
} from "../../Features/user/userProfileApi";
import { toast } from "react-toastify";

const ImageGrid = memo(({ images, onLoadMore, hasMore, isLoadingMore }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeletingModal, setIsDeletingModal] = useState(false);
  const [isMakingModal, setIsMakingModal] = useState(false);

  const [deleteImage] = useDeleteImageMutation();
  const [makeProfilePhoto] = useMakeProfilePhotoMutation();
  const { refetch } = useCurrentProfileImageQuery();

  const handleDelete = async (id) => {
    try {
      await deleteImage(id).unwrap();
      toast.success("Deleted successfully");
      return true;
    } catch (error) {
      toast.error("Delete failed");
      return false;
    }
  };

  const handleMakeProfilePhoto = async (id) => {
    try {
      const response = await makeProfilePhoto(id).unwrap();
      toast.success(response?.message || "Profile updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleModalDelete = async (id) => {
    setIsDeletingModal(true);
    const success = await handleDelete(id);
    setIsDeletingModal(false);
    if (success && images.length > 0) {
      const newIndex = images.findIndex((img) => img.id === id);
      if (newIndex !== -1) {
        if (currentIndex === images.length - 1) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      }
    }
    return success;
  };

  const handleModalMakeProfile = async (id) => {
    setIsMakingModal(true);
    await handleMakeProfilePhoto(id);
    setIsMakingModal(false);
  };

  const handleSliderIndexChange = (newIndex) => {
    setCurrentIndex(newIndex);

    const threshold = Math.ceil(images.length * 0.8);
    if (newIndex >= threshold && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {images.map((img, index) => {
        const imageSrc =
          img?.image?.secure_url || img?.image?.url || img?.image;

        return (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => {
              setCurrentIndex(index);
              setOpenModal(true);
            }}
          >
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div
              className={`
                absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                flex flex-col justify-end p-3
                transition-opacity duration-300
                md:opacity-0 md:group-hover:opacity-100
                opacity-100
              `}
            ></div>
          </div>
        );
      })}

      {/* Modal */}
      {openModal && (
        <MediaImageModal
          images={images}
          currentIndex={currentIndex}
          setCurrentIndex={handleSliderIndexChange}
          setOpenModal={setOpenModal}
          onDelete={handleModalDelete}
          onMakeProfile={handleModalMakeProfile}
          isDeleting={isDeletingModal}
          isMaking={isMakingModal}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={onLoadMore}
        />
      )}
    </div>
  );
});

ImageGrid.displayName = "ImageGrid";

export default ImageGrid;

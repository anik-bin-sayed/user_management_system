import React, { useEffect, memo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

const MediaImageModal = memo(
  ({
    images,
    currentIndex,
    setCurrentIndex,
    setOpenModal,
    onDelete,
    onMakeProfile,
    isDeleting,
    isMaking,
    hasMore,
    isLoadingMore,
    onLoadMore,
  }) => {
    const currentImage = images[currentIndex];
    const imageId = currentImage?.id;

    const imageSrc =
      currentImage?.image?.secure_url ||
      currentImage?.image?.url ||
      currentImage?.image;

    const handleNext = () => {
      const nextIndex = currentIndex + 1;

      // If at end and more images available, load them
      if (
        nextIndex >= images.length &&
        hasMore &&
        !isLoadingMore &&
        onLoadMore
      ) {
        onLoadMore();
        return;
      }

      // If not at end, just move forward
      if (nextIndex < images.length) {
        setCurrentIndex(nextIndex);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    const handleDelete = async () => {
      if (!imageId) return;
      const success = await onDelete(imageId);
      if (success) {
        if (images.length === 1) {
          setOpenModal(false);
        } else {
          setCurrentIndex((prev) => {
            if (prev === images.length - 1) return prev - 1;
            return prev;
          });
        }
      }
    };

    const handleMakeProfile = async () => {
      if (!imageId) return;
      await onMakeProfile(imageId);
    };

    useEffect(() => {
      const handleKey = (e) => {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") setOpenModal(false);
      };

      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [currentIndex, images.length, hasMore, isLoadingMore]);

    const canGoPrev = currentIndex > 0;
    const canGoNext =
      currentIndex < images.length - 1 || (hasMore && !isLoadingMore);

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        {/* Close button */}
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-5 right-5 text-white hover:scale-110 transition z-10"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="absolute left-5 text-white bg-black/40 p-2 rounded-full hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="absolute right-5 text-white bg-black/40 p-2 rounded-full hover:bg-black/70 transition disabled:opacity-30 disabled:cursor-not-allowed z-10"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>

        {/* Image container */}
        <div className="max-w-5xl w-full px-4 relative">
          <img
            src={imageSrc}
            alt="preview"
            className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />

          {/* Loading indicator for next page */}
          {isLoadingMore && (
            <div className="absolute top-2 right-2 text-white">
              <svg
                className="animate-spin w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Bottom bar with counter and action buttons */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-4 text-white">
          {/* Counter */}
          <div className="bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
            {hasMore && " (more loading)"}
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition disabled:opacity-50"
            aria-label="Delete image"
          >
            {isDeleting ? (
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <FaRegTrashCan />
            )}
            <span>Delete</span>
          </button>

          {/* Make Profile button */}
          <button
            onClick={handleMakeProfile}
            disabled={isMaking}
            className="bg-white/80 hover:bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 transition disabled:opacity-50"
            aria-label="Set as profile photo"
          >
            {isMaking ? (
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <MdAdd />
            )}
            <span>Make as Profile Photo</span>
          </button>
        </div>
      </div>
    );
  },
);

MediaImageModal.displayName = "MediaImageModal";

export default MediaImageModal;

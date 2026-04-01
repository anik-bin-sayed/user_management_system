import React, { useState, useEffect } from "react";

import ImageGrid from "./ImageGrid";
import { useGalleryImagesQuery } from "../../Features/user/userProfileApi";

const Media = () => {
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const { data: galleryData, isLoading } = useGalleryImagesQuery(page);

  useEffect(() => {
    if (galleryData?.results) {
      setAllImages((prev) => {
        if (page === 1) {
          return galleryData.results;
        } else {
          const existingIds = new Set(prev.map((img) => img.id));
          const newImages = galleryData.results.filter(
            (img) => !existingIds.has(img.id),
          );
          return [...prev, ...newImages];
        }
      });

      setTotalCount(galleryData.count || 0);
      setNextPageUrl(galleryData.next || null);
    }
  }, [galleryData, page]);

  const hasMore = nextPageUrl !== null;

  const loadNextPage = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="mb-4 text-sm text-gray-500">
        Total images: {totalCount} | Loaded: {allImages.length}
      </div>

      {allImages.length > 0 ? (
        <>
          <ImageGrid
            images={allImages}
            onLoadMore={loadNextPage}
            hasMore={hasMore}
            isLoadingMore={isLoading}
          />

          {hasMore && (
            <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={loadNextPage}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasMore && allImages.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              All {allImages.length} images loaded
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading images...</div>
      ) : (
        <div className="text-center py-12 text-gray-500">No images yet</div>
      )}
    </div>
  );
};

export default Media;

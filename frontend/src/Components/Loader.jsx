import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-blue-300 border-b-transparent rounded-full animate-spin-slow"></div>
        </div>

        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Loading...
        </p>

        <div className="w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

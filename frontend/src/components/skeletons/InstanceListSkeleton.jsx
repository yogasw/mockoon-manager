// frontend/src/components/skeletons/InstanceListSkeleton.jsx
import React from 'react';

const InstanceListSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((key) => (
        <div key={key} className="p-4 bg-gray-700 rounded">
          <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
          <div className="h-5 w-40 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default InstanceListSkeleton;
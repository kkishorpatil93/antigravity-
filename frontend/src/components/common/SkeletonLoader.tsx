import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = 'h-4 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-200/80 rounded-md mb-2 ${className}`}
        />
      ))}
    </>
  );
};


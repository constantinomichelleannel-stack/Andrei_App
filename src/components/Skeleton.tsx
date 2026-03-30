import React from 'react';
import { motion } from 'motion/react';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </header>

      <Skeleton className="h-48 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>

      <Skeleton className="h-40 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
};

export const DocumentLibrarySkeleton = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Skeleton className="h-[600px] w-full" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

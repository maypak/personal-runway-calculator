"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-bg-tertiary rounded-lg" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-bg-tertiary rounded-lg" />
          <div className="h-10 w-10 bg-bg-tertiary rounded-lg" />
          <div className="h-10 w-24 bg-bg-tertiary rounded-lg" />
        </div>
      </div>

      {/* Runway Card */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-6 md:p-8">
        <div className="flex justify-between mb-6">
          <div className="h-6 w-40 bg-bg-tertiary rounded" />
          <div className="h-12 w-12 bg-bg-tertiary rounded-full" />
        </div>
        <div className="text-center mb-6">
          <div className="h-16 w-48 bg-bg-tertiary rounded-lg mx-auto mb-4" />
          <div className="h-4 w-72 bg-bg-tertiary rounded mx-auto" />
        </div>
        <div className="h-4 w-full bg-bg-tertiary rounded-full mb-2" />
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="h-16 bg-bg-tertiary rounded" />
          <div className="h-16 bg-bg-tertiary rounded" />
          <div className="h-16 bg-bg-tertiary rounded" />
        </div>
      </div>

      {/* Goal Card */}
      <div className="h-32 bg-bg-tertiary rounded-xl" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-bg-tertiary rounded-xl" />
        <div className="h-24 bg-bg-tertiary rounded-xl" />
        <div className="h-24 bg-bg-tertiary rounded-xl" />
      </div>

      {/* Budget Progress */}
      <div className="h-24 bg-bg-tertiary rounded-xl" />

      {/* Expenses List */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-5">
        <div className="flex justify-between mb-4">
          <div className="h-6 w-32 bg-bg-tertiary rounded" />
          <div className="h-10 w-28 bg-bg-tertiary rounded-lg" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-bg-tertiary rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

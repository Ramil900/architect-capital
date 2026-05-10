import { SkeletonCard } from "./SkeletonCard";

export function LoadingState() {
  return (
    <div className="flex flex-col gap-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[90, 90, 90, 90].map((h, i) => (
          <SkeletonCard key={i} height={h} lines={2} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard height={200} lines={3} />
        <SkeletonCard height={200} lines={3} />
      </div>

      {/* Table / detail */}
      <SkeletonCard height={240} lines={5} />
    </div>
  );
}

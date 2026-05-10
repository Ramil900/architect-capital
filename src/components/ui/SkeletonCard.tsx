interface Props {
  height?:  number | string;
  lines?:   number;
  className?: string;
}

export function SkeletonCard({ height = 120, lines = 2, className = "" }: Props) {
  return (
    <div
      className={`rounded-lg border overflow-hidden ${className}`}
      style={{
        background:   "var(--bg-card)",
        borderColor:  "var(--border)",
        height:       typeof height === "number" ? `${height}px` : height,
      }}
    >
      <div className="p-5 flex flex-col gap-3 h-full">
        <div
          className="h-2.5 w-20 rounded-full animate-pulse"
          style={{ background: "var(--border)" }}
        />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="rounded-full animate-pulse"
            style={{
              background: "var(--border)",
              height:     "10px",
              width:      i === 0 ? "55%" : i === 1 ? "40%" : "30%",
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

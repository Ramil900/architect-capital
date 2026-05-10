export function PageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</span>
      </div>
    </div>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="rounded-lg border p-6 text-center max-w-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--red)" }}>Failed to load</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{message}</p>
      </div>
    </div>
  );
}

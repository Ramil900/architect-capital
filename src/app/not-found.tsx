import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md text-center">
        <p
          className="text-8xl font-bold mb-6 tracking-tighter"
          style={{ color: "var(--text-primary)", opacity: 0.08 }}
        >
          404
        </p>

        <p
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Page Not Found
        </p>

        <h1
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          This page doesn&apos;t exist
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The route you requested could not be found. It may have been moved,
          renamed, or never existed.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <LayoutDashboard size={14} />
          Go Dashboard
        </Link>
      </div>
    </div>
  );
}

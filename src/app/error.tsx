"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

interface Props {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(239,68,68,0.12)", color: "var(--red, #ef4444)" }}
        >
          <AlertTriangle size={26} strokeWidth={1.5} />
        </div>

        <p
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          System Error
        </p>

        <h1
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Something went wrong
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          An unexpected error occurred. Your data is safe — please try again or
          return to the dashboard.
        </p>

        {error.digest && (
          <p
            className="text-xs font-mono mb-8 px-3 py-2 rounded"
            style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            <LayoutDashboard size={14} />
            Go Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

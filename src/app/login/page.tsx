import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <BrainCircuit size={16} color="#fff" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ color: "var(--text-primary)" }}>Architect Capital</p>
            <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-muted)" }}>AI Investment Intelligence</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-6">
            <h1 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Sign in</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Access your institutional investment dashboard.
            </p>
          </div>

          <LoginForm />

          <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              No account?{" "}
              <Link href="/register" className="font-medium transition-opacity hover:opacity-80" style={{ color: "var(--accent)" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Institutional-grade portfolio management
        </p>
      </div>
    </div>
  );
}

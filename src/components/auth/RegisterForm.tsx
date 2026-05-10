"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";

const schema = z
  .object({
    email:           z.string().email("Enter a valid email address"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [serverError,  setServerError]  = useState<string | null>(null);
  const [successMsg,   setSuccessMsg]   = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSuccessMsg(null);
    try {
      const { error } = await getBrowserClient().auth.signUp({
        email:    values.email,
        password: values.password,
      });
      if (error) {
        setServerError(error.message);
      } else {
        setSuccessMsg("Check your email to confirm your account.");
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registration failed. Check your connection.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {/* Email */}
      <Field label="Email address" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm border outline-none transition-colors"
          style={{
            background:  "var(--bg-secondary)",
            borderColor: errors.email ? "var(--red)" : "var(--border)",
            color:       "var(--text-primary)",
          }}
        />
      </Field>

      {/* Password */}
      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-sm border outline-none transition-colors"
            style={{
              background:  "var(--bg-secondary)",
              borderColor: errors.password ? "var(--red)" : "var(--border)",
              color:       "var(--text-primary)",
            }}
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </Field>

      {/* Confirm password */}
      <Field label="Confirm password" error={errors.confirmPassword?.message}>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat password"
            className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-sm border outline-none transition-colors"
            style={{
              background:  "var(--bg-secondary)",
              borderColor: errors.confirmPassword ? "var(--red)" : "var(--border)",
              color:       "var(--text-primary)",
            }}
          />
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </Field>

      {/* Server error */}
      {serverError && (
        <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: "var(--red)", borderColor: "var(--red)", background: "color-mix(in srgb, var(--red) 8%, transparent)" }}>
          {serverError}
        </p>
      )}

      {/* Success */}
      {successMsg && (
        <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: "var(--green)", borderColor: "var(--green)", background: "color-mix(in srgb, var(--green) 8%, transparent)" }}>
          {successMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-60"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        {isSubmitting ? (
          <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
        ) : (
          <UserPlus size={14} />
        )}
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}
    </div>
  );
}

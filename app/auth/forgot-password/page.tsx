"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ForgotPasswordSchema } from "@/lib/zod";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.requestPasswordReset(
        {
          email: values.email,
          redirectTo: "/auth/reset-password",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: (success: any) => {
            setSuccess(
              success.data.message ||
                "Reset password link has been sent to your email.",
            );
            setLoading(false);
          },
          onError: (ctx: any) => {
            setError(ctx.error.message);
            setLoading(false);
          },
        },
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Hero Background Gradient Overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/50 blur-[120px] rounded-full -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full -ml-64 -mb-32"></div>

      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative z-10 border border-gray-100">
        {!success && (
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold text-[#333] mb-2 tracking-tight">
              Forgot Password
            </h1>
            <p className="text-[#666] text-[15px] font-medium">
              Enter your email to receive a password reset link.
            </p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 text-center border border-green-200">
              <p className="font-medium mb-1">Check your email</p>
              <p>{success}</p>
            </div>
            <Link
              href="/auth/sign-in"
              className="block w-full text-center h-[46px] leading-[46px] rounded-lg bg-indigo-600 text-white font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Email
              </label>
              <input
                {...register("email")}
                disabled={loading}
                type="email"
                placeholder="name@work-email.com"
                className="w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-lg bg-indigo-600 text-white font-bold text-[15px] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-8 text-center text-[14px] text-gray-500">
            Remember your password?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import SignInForm from "@/app/components/sign-in-form";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  const handleSignInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/auth/sign-in",
    });
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
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-[#333] mb-2 tracking-tight">
            Sign in
          </h1>
          <p className="text-[#666] text-[15px] font-medium">
            Sign in or create an account.
          </p>
        </div>

        <div className="space-y-4">
          <SignInForm
            handleSignIn={handleSignIn}
            error={error}
            loading={loading}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="grid gap-4">
            {/* Google Button */}
            <button
              onClick={handleSignInWithGoogle as any}
              disabled={loading}
              className="w-full h-[46px] rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="text-[#444] font-medium text-[15px]">
                Google
              </span>
            </button>

            {/* GitHub Button */}
            <button
              onClick={async () => {
                setLoading(true);
                await authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/",
                  errorCallbackURL: "/auth/sign-in",
                });
              }}
              disabled={loading}
              className="w-full h-[46px] rounded-lg border border-gray-300 bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FaGithub className="w-5 h-5 text-gray-800" />
              <span className="text-[#444] font-medium text-[15px]">
                GitHub
              </span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[14px] text-gray-500">
          Don't have an account?{" "}
          <a
            href="/auth/sign-up"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

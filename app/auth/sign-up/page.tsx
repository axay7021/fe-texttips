"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  const handleSignUpWithGoogle = async () => {
    setLoading(true);
    setError(null);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/auth/sign-in", // Redirect to sign-in on error usually
    });
  };

  const handleSignUpWithGithub = async () => {
    setLoading(true);
    setError(null);
    await authClient.signIn.social({
      provider: "github",
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
            Sign up
          </h1>
          <p className="text-[#666] text-[15px] font-medium">
            Sign in or create an account.
          </p>
        </div>

        <div className="space-y-4">
          <form className="space-y-5" onSubmit={handleSignUp}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Name
              </label>
              <input
                required
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                placeholder="name@work-email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[46px] rounded-lg border border-gray-300 px-4 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[46px] rounded-lg border border-gray-300 px-4 pr-12 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-lg bg-indigo-600 text-white font-bold text-[15px] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="grid gap-4">
            {/* Google Button */}
            <button
              onClick={handleSignUpWithGoogle}
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
              onClick={handleSignUpWithGithub}
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
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

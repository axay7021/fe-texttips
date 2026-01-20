"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const SignInForm = ({
  handleSignIn,
  error,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: {
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form className="space-y-5" onSubmit={handleSignIn}>
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
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Password
          </label>
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            Forgot password?
          </a>
        </div>
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
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;

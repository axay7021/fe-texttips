"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa6";
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
      }
    );
  };

  const handleSignInWithGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
      errorCallbackURL: "/auth/sign-in",
    });
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          Sign In
        </h1>

        <SignInForm
          handleSignIn={handleSignIn}
          error={error}
          loading={loading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        <div className="my-4">
          <p className="text-center">or</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <form
            onSubmit={handleSignInWithGitHub}
            className="flex items-center justify-center"
          >
            <button
              type="submit"
              disabled={loading}
              className="w-fit rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing In..." : <FaGithub />}
            </button>
          </form>

          <form
            onSubmit={handleSignInWithGoogle}
            className="flex items-center justify-center"
          >
            <button
              type="submit"
              disabled={loading}
              className="w-fit rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing In..." : <FaGoogle />}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/auth/sign-up" className="font-medium text-black underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

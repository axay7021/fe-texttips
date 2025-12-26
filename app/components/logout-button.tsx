"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Hard reload to clear all client-side state/cache
          window.location.href = "/auth/sign-in";
        },
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="border-2 border-solid px-4 py-1 rounded-md hover:opacity-80 cursor-pointer transition-300 transition-all"
    >
      logout
    </button>
  );
}

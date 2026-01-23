"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      authClient.verifyEmail(
        {
          query: {
            token: token,
          },
        },
        {
          onSuccess: () => {
            setStatus("success");
            setTimeout(() => router.push("/"), 3000);
          },
          onError: (ctx) => {
            setStatus("error");
            console.error(ctx.error.message);
          },
        },
      );
    } else {
      setStatus("error");
    }
  }, [token, router]);

  if (status === "verifying") return <h1>Verifying your email...</h1>;
  if (status === "success") return <h1>Email Verified! Redirecting...</h1>;
  return <h1>Verification failed. The link may be invalid or expired.</h1>;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<h1>Verifying...</h1>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

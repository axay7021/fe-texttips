import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { BackgroundAnimation } from "@/components/background-animation";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(255, 255, 255, 1) 0%, rgba(243, 243, 243, 1) 100%)",
      }}
    >
      {/* Navbar */}
      <Navbar session={session} />
      <BackgroundAnimation />

      <main className="relative z-10">
        <HeroSection />
      </main>
    </div>
  );
}

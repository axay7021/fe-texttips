import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardTextEnhancerUI } from "@/components/dashboard-text-enhancer-ui";
import { BackgroundAnimation } from "@/components/background-animation";

import { getUserSubscription } from "@/app/api/plans/service";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Fetch subscription
  const subscription = await getUserSubscription();

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <BackgroundAnimation />
          {/* <HeroBadges /> */}
        </div>

        {/* Navbar with hidden navigation links */}
        <Navbar
          session={session}
          hideNavigation={true}
          subscription={subscription}
        />

        {/* Main Content Area */}
        <main className="relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-80px)] px-4 pb-20 pt-20 md:pt-32">
          <div className="w-full max-w-[1120px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            <DashboardTextEnhancerUI
              isPro={
                subscription?.isActive && subscription?.plan?.name !== "Free"
              }
            />
          </div>
        </main>
      </div>
      <FaqSection />
      <Footer />
    </>
  );
}

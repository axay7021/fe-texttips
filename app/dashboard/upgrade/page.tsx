import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import PricingSection from "@/components/pricing-section";
import { getPlans, getUserSubscription } from "@/app/api/plans/service";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Fetch data
  const [plans, subscription] = await Promise.all([
    getPlans(),
    getUserSubscription(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar
        session={session}
        hideNavigation={true}
        subscription={subscription}
      />

      <main className="pt-24 pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
              Upgrade your plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan to unlock advanced features and
              limitations for your content creation.
            </p>
          </div>

          <PricingSection
            plans={plans}
            currentPlanId={subscription?.plan?._id}
          />
        </div>
      </main>

      <FaqSection />
      <Footer />
    </div>
  );
}

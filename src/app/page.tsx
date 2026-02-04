import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AboutSection from '@/components/about-section';
import FaqSection from '@/components/faq-section';
import FeatureSection from '@/components/feature-section';
import Footer from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { Navbar } from '@/components/navbar';
import PricingSection from '@/components/pricing-section';
import { auth } from '@/lib/auth/auth';

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div
      className='min-h-screen relative overflow-hidden'
      style={{
        background:
          'linear-gradient(180deg,rgba(255, 255, 255, 1) 0%, rgba(243, 243, 243, 1) 100%)',
      }}
    >
      {/* Navbar */}
      <Navbar session={session} />

      <main className='relative z-10'>
        <HeroSection />
        <AboutSection />
        <PricingSection />
        <FeatureSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/app/actions/subscription';
import FaqSection from '@/components/faq-section';
import Footer from '@/components/footer';
import { Navbar } from '@/components/navbar';
import PricingSection from '@/components/pricing-section';
import { auth } from '@/lib/auth/auth';

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ['user-subscription'],
    queryFn: () => getUserSubscription(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className='min-h-screen bg-white'>
        {/* Navbar */}
        <Navbar session={session} hideNavigation={true} />

        <main className='pt-24 pb-20'>
          <div className='mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-10 md:mb-16 space-y-4'>
              <h1 className='text-3xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight'>
                Upgrade your plan
              </h1>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                Choose the perfect plan to unlock advanced features and
                limitations for your content creation.
              </p>
            </div>

            <PricingSection session={session} />
          </div>
        </main>

        <FaqSection />
        <Footer />
      </div>
    </HydrationBoundary>
  );
}

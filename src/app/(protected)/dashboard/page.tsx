import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getUserSubscription } from '@/app/actions/subscription';
import { BackgroundAnimation } from '@/components/background-animation';
import { DashboardTextEnhancerUI } from '@/components/dashboard-text-enhancer-ui';
import FaqSection from '@/components/faq-section';
import Footer from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { auth } from '@/lib/auth/auth';

export default async function Dashboard() {
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
      <div className='min-h-screen relative overflow-hidden bg-white'>
        {/* Background Elements */}
        <div className='absolute inset-0 pointer-events-none z-0'>
          <BackgroundAnimation />
          {/* <HeroBadges /> */}
        </div>

        {/* Navbar with hidden navigation links */}
        <Navbar session={session} hideNavigation={true} />

        {/* Main Content Area */}
        <main className='relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-80px)] px-4 pb-20 pt-20 md:pt-32'>
          <div className='w-full max-w-[1120px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700'>
            <DashboardTextEnhancerUI />
          </div>
        </main>
      </div>
      <FaqSection />
      <Footer />
    </HydrationBoundary>
  );
}

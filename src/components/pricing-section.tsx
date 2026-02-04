'use client';

import pricingPencilePattern from '@public/pricing-pencile-pattern.png';
import { Check, CheckCircle, Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti-boom';
import { getUserSubscription } from '@/app/actions/subscription';
import Tabs from '@/components/tabs/Tabs';
import { Button } from '@/components/ui/button';
import { useQueryData } from '@/hooks/useQueryData';
import { authClient } from '@/lib/auth/auth-client';
import plans from '@/utils/plans';

const PricingSection = ({ session }: { session?: any }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>(
    'personal',
  );
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const { data: subscriptions } = useQueryData(['user-subscription'], () =>
    getUserSubscription(),
  );

  const currentPlan = subscriptions
    ? subscriptions.find(
        (sub) => sub.status === 'active' || sub.status === 'trialing',
      )
    : undefined;

  // Optional clear params after showing
  useEffect(() => {
    if (!success && !canceled) return;

    // clean up url after 5 seconds or just leave it
    const timer = setTimeout(() => {
      router.replace('/dashboard/upgrade', { scroll: false });
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, canceled, router]);

  const filteredPlans = plans.filter((plan) => plan.type === activeTab);

  const handleUpgrade = async (planName: string) => {
    if (!session) {
      redirect('/auth/sign-in');
    }

    if (planName === 'Free' || loadingPlanId) return;

    try {
      setLoadingPlanId(planName);

      await authClient.subscription.upgrade({
        plan: planName,
        subscriptionId: currentPlan ? currentPlan?.id : '',
        referenceId: session?.user?.id,
        returnUrl: window.location.href,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
    } catch {
      setLoadingPlanId(null);
    }
  };

  return (
    <section
      className='relative pb-10 md:pb-20 px-4 overflow-hidden bg-white'
      id='pricing'
    >
      {/* Confetti */}
      {success && (
        <div className='flex justify-center fixed top-0 left-0 w-full h-full'>
          <Confetti mode='boom' particleCount={50} shapeSize={20} />
        </div>
      )}

      {/* Background Pattern - Placeholder as requested */}
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none z-0'></div>

      {/* Pencile pattern */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full'>
        <Image
          src={pricingPencilePattern}
          alt='Pencil Pattern'
          fill
          className='w-full h-full object-contain'
        />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto flex flex-col items-center'>
        {/* Status Messages */}
        {success && (
          <div className='mb-8 w-full max-w-md bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800 animate-in fade-in slide-in-from-top-4'>
            <CheckCircle className='w-5 h-5 shrink-0' />
            <p className='text-sm font-medium'>
              Subscription updated successfully! Enjoy your new plan.
            </p>
          </div>
        )}

        {canceled && (
          <div className='mb-8 w-full max-w-md bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 text-yellow-800 animate-in fade-in slide-in-from-top-4'>
            <XCircle className='w-5 h-5 shrink-0' />
            <p className='text-sm font-medium'>
              Upgrade canceled. You can try again whenever you&apos;re ready.
            </p>
          </div>
        )}

        {/* Header */}
        <div className='text-center space-y-4 mb-12'>
          <span className='text-brand-blue font-semibold text-[22px]'>
            Select your plan
          </span>
          <h2 className='text-3xl md:text-[36px] font-bold text-heading'>
            Start your content
            <br className='hidden md:block' /> writing with AI
          </h2>
        </div>

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cards Container */}
        <div className='flex flex-wrap justify-center items-stretch gap-5 w-full max-w-7xl'>
          {filteredPlans.map((plan) => {
            const isCurrent = currentPlan
              ? String(plan?.name)?.toLocaleLowerCase() ===
                String(currentPlan?.plan)?.toLocaleLowerCase()
              : false;
            // If user has a plan, highlight ONLY that plan. Otherwise fallback to recommended.
            const isHighlighted = currentPlan ? isCurrent : plan.isPopular;
            const isLoading = loadingPlanId === plan.name;

            return (
              <div
                key={plan.name}
                style={{
                  background: isHighlighted
                    ? '#3B9DF8'
                    : 'linear-gradient(125deg,rgba(215, 215, 215, 1) 0%, rgba(249, 249, 249, 1) 84%)',
                }}
                className={`rounded-[20px] h-auto! p-1.5 ${
                  isHighlighted
                    ? 'flex flex-col relative shadow-xl shadow-blue-200 md:-translate-y-6'
                    : 'flex flex-col relative'
                } h-full overflow-hidden w-full max-w-[400px]`}
              >
                {/* Optional Banner */}
                {isHighlighted ? (
                  <div className='text-center py-2 text-white font-bold text-sm tracking-wide uppercase'>
                    {isCurrent ? 'Current Plan' : 'Recommended'}
                  </div>
                ) : plan.name === 'Free' ? (
                  <div className='text-center py-2 text-paragraph text-sm font-medium'>
                    Free Trial for 3 Days*
                  </div>
                ) : (
                  <div className='h-[36px]'></div>
                )}

                {/* Main White Content Card */}
                <div
                  className={`${
                    isHighlighted ? 'bg-[#F8F9FB]' : 'bg-[#F7F7F7]'
                  } rounded-[16px] px-4 py-6 flex flex-col flex-1`}
                >
                  <div className='mb-4'>
                    <h3 className='text-[22px] leading-tight font-semibold text-heading mb-2'>
                      {plan.name}
                    </h3>
                    <p className='text-paragraph text-[15px] leading-relaxed mb-6 min-h-[45px]'>
                      {plan.description}
                    </p>
                    <div className='mb-8 items-baseline flex gap-2'>
                      <span className='text-5xl font-semibold text-heading tracking-tight'>
                        ${plan.priceUsd}
                      </span>
                      {plan.originalPriceUsd > plan.priceUsd && (
                        <span className='text-lg text-gray-400 line-through'>
                          ${plan.originalPriceUsd}
                        </span>
                      )}
                    </div>

                    <Button
                      variant={isHighlighted ? 'default' : 'outline'}
                      disabled={isCurrent || isLoading || plan.name === 'Free'}
                      onClick={() => !isCurrent && handleUpgrade(plan.name)}
                      className={`w-full rounded-xl h-14 text-lg font-medium transition-all shadow-none cursor-pointer ${
                        isHighlighted
                          ? 'bg-transparent border border-[#3B9DF8] text-[#3B9DF8] hover:bg-[#3B9DF8] hover:text-white'
                          : 'border-[#E5E5E5] text-[#AAAAAA] hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : isCurrent ? (
                        'Current Plan'
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  </div>

                  <div className='space-y-6 mt-2'>
                    <div>
                      <h4 className='font-semibold text-heading text-[16px] mb-2'>
                        Features:
                      </h4>
                      <ul className='space-y-1'>
                        {plan.features.map((feature, idx) => (
                          <li
                            // biome-ignore lint/suspicious/noArrayIndexKey: Static features list
                            key={idx}
                            className='flex items-start gap-3 text-paragraph text-[15px]'
                          >
                            <Check className='w-5 h-5 text-[#AAAAAA] stroke-3 mt-0.5 shrink-0' />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Subscription {
    plan?: {
        name: string;
        price: number;
        interval: string;
    };
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    nextBilling?: {
        amount: number;
        date: string;
    };
}

import { toast } from "sonner";

export default function CurrentSubscription({ subscription }: { subscription: any }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  if (!subscription || !subscription.plan) {
      return (
          <div className="bg-white border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Subscription</h2>
              <p className="text-gray-500">You do not have an active subscription.</p>
          </div>
      );
  }

  const handleCancelClick = () => {
      setShowConfirm(true);
  };

  const confirmCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (res.ok) {
        setShowConfirm(false);
        toast.success("Subscription cancelled. You will retain access until the end of the period.");
        router.refresh();
      } else {
        toast.error("Failed to cancel subscription.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const isCanceled = subscription.cancelAtPeriodEnd;
  
  // Safe Date Parsing
  let renewalDate = new Date(subscription.endDate);
  // Fallback if date is invalid
  if (isNaN(renewalDate.getTime())) {
      renewalDate = new Date(); // Default to now to prevent crash
  }
  
  const formatDateSafe = (date: Date) => {
      try {
          return format(date, "MMMM d, yyyy");
      } catch (e) {
          return "Unknown Date";
      }
  };

  // Safely access fields
  const price = subscription.plan.priceUsd || 0;
  const interval = subscription.plan.interval || 'month'; 

  return (
    <>
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Current Plan</h2>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{subscription.plan.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCanceled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {isCanceled ? 'Cancels Soon' : 'Active'}
                </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
                {isCanceled 
                    ? `Access until ${formatDateSafe(renewalDate)}`
                    : subscription.nextBilling 
                        ? `Renews on ${formatDateSafe(new Date(subscription.nextBilling.date))} for $${subscription.nextBilling.amount.toFixed(2)}`
                        : `Renews on ${formatDateSafe(renewalDate)} for $${price}/${interval}`
                }
            </p>
            </div>

            <div>
                {!isCanceled && (
                    <button 
                        onClick={handleCancelClick}
                        disabled={loading}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Cancel Subscription
                    </button>
                )}
                {isCanceled && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Subscription Cancelled</span>
                    </div>
                )}
            </div>
        </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Cancel Subscription?</h3>
                        <p className="text-gray-500 mt-2">
                            Are you sure you want to cancel? You will keep access to your plan features until the end of your current billing period.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Keep Plan
                        </button>
                        <button
                            onClick={confirmCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Yes, Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
}

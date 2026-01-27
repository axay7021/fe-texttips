
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import PaymentHistoryTable from "@/components/payment-history-table";
import CreditBalance from "@/components/credit-balance";
import { getPaymentHistory, getUserCreditBalance } from "@/app/api/payments/service";
import { getUserSubscription } from "@/app/api/plans/service";
import CurrentSubscription from "@/components/current-subscription";

export default async function PaymentHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const [payments, creditBalance, subscription] = await Promise.all([
    getPaymentHistory(),
    getUserCreditBalance(),
    getUserSubscription()
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar session={session} hideNavigation={true} subscription={subscription} />
      <main className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing & Payments</h1>
        
        <div className="grid gap-8">
            {/* Current Subscription Section */}
            <CurrentSubscription subscription={subscription} />

            {/* Credit Balance Section */}
            <CreditBalance balance={creditBalance} />

            {/* Payment Table */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
                </div>
                <PaymentHistoryTable payments={payments} />
            </div>
        </div>
      </main>
    </div>
  );
}

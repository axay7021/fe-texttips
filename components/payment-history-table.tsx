import { format } from "date-fns";
import { Download } from "lucide-react";
import Link from "next/link";

// Match IPayment structure roughly
interface PaymentRecord {
    _id: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    createdAt: string;
    stripeInvoiceId?: string;
}

export default function PaymentHistoryTable({ payments }: { payments: PaymentRecord[] }) {
  if (payments.length === 0) {
    return <div className="p-8 text-center text-gray-500">No payment history found.</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = (type: string) => {
      switch(type) {
          case 'subscription_create': return 'Subscription Started';
          case 'subscription_renew': return 'Renewal';
          case 'proration_credit': return 'Proration Credit';
          case 'payout_refund': return 'Refund Payout';
          case 'refund': return 'Refund';
          default: return type.replace(/_/g, ' ');
      }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-900 font-medium uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Invoice</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                {format(new Date(payment.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {getLabel(payment.type)}
              </td>
              <td className="px-6 py-4">
                 {payment.type === 'proration_credit' ? '+' : ''}
                 ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {payment.stripeInvoiceId ? (
                   <Link 
                      href={`/api/stripe/invoice/${payment.stripeInvoiceId}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                   >
                     <Download className="w-4 h-4" />
                     <span>PDF</span>
                   </Link>
                ) : (
                    <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

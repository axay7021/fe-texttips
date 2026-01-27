"use client";

import { Info } from "lucide-react";

export default function CreditBalance({ balance }: { balance: number }) {
  if (balance <= 0) return null;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Store Credit Balance</h2>
        
        <div className="mt-2 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 max-w-md">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium">
                Credits are automatically applied to your next invoice.
            </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-3xl font-bold text-green-600">
          ${balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

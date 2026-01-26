import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { IoSparkles } from "react-icons/io5";
import { motion } from "framer-motion";

interface PlanTabProps {
  subscription?: any;
}

export function PlanTab({ subscription }: PlanTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Plan Card */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              subscription
                ? "bg-brand-blue/10 text-brand-blue"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {subscription ? "Active" : "Free Tier"}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500 font-medium mb-1">
            Current Plan
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {subscription?.plan?.name || "Free"} Plan
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard/upgrade" className="w-full">
            <Button className="w-full bg-brand-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all rounded-xl h-10 px-6">
              <IoSparkles className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 font-medium mb-1">
            Cycle Started
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(subscription?.startDate || Date.now()).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )}
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 font-medium mb-1">
            {subscription?.endDate ? "Next Billing" : "Remaining Credits"}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {subscription?.endDate
              ? new Date(subscription.endDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })
              : "3 Credits"}
          </div>
        </div>
      </div>

      {/* Features List */}
      {subscription?.plan?.features && (
        <div className="pt-2">
          <h4 className="font-semibold text-gray-900 mb-4">
            Included Features
          </h4>
          <ul className="grid grid-cols-1 gap-3">
            {subscription.plan.features.map((feature: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600"
              >
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-blue" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

import { ShieldCheck } from "lucide-react";

export function DashboardSubscriptionCard() {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6" />
        <div className="text-sm font-semibold">Current plan</div>
      </div>
      <div className="text-sm font-medium">Fibr Pro</div>
    </div>
  );
}

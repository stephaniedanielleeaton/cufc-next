import { Users, DollarSign, Link as LinkIcon, CreditCard,
    CalendarCheck } from "lucide-react";

interface DashboardToolCardProps {
  label: string;
  icon: "users" | "dollar-sign" | "link" | "credit-card" | "calendar-check";
}

const iconMap = {
  "credit-card": CreditCard,
  "calendar-check": CalendarCheck,
  "users": Users,
  "dollar-sign": DollarSign,
  "link": LinkIcon,
};

export function DashboardToolCard({ label, icon }: DashboardToolCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-700" />
        <span className="text-sm text-gray-800 font-medium">{label}</span>
      </div>
    </div>
  );
}

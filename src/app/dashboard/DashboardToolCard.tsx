import {
  Users,
  DollarSign,
  Link as LinkIcon,
  CreditCard,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";

interface DashboardToolCardProps {
  label: string;
  icon: "users" | "dollar-sign" | "link" | "credit-card" | "calendar-check";
  disabled?: boolean;
}

const iconMap = {
  users: Users,
  "dollar-sign": DollarSign,
  link: LinkIcon,
  "credit-card": CreditCard,
  "calendar-check": CalendarCheck,
};

export function DashboardToolCard({ label, icon, disabled = false }: DashboardToolCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={`flex items-center justify-between px-2 py-2 rounded-md transition ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "hover:bg-gray-50 cursor-pointer text-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${disabled ? "text-gray-300" : "text-gray-700"}`} />
        <span className={`text-sm font-medium ${disabled ? "text-gray-400" : ""}`}>{label}</span>
      </div>
      {!disabled && <ChevronRight className="w-4 h-4 text-gray-400" />}
    </div>
  );
}

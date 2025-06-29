import { AlertCircle } from "lucide-react";

type UserNameWithAlertProps = {
  displayName?: string | null;
  user: any;
  profileComplete: boolean;
  className?: string;
};

export function UserNameWithAlert({ displayName, user, profileComplete, className = "" }: UserNameWithAlertProps) {
  return (
    <span className={`ml-2 font-semibold flex items-center gap-1 ${className}`}>
      {displayName || user.name || user.nickname || user.email}
      {!profileComplete && (
        <AlertCircle size={20} className="text-yellow-400 ml-1" aria-label="Profile incomplete" />
      )}
    </span>
  );
}

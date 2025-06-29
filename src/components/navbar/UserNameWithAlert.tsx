import { AlertCircle } from "lucide-react";

type Auth0User = {
  picture?: string;
  name?: string;
  nickname?: string;
  email?: string;
  // add other Auth0 user fields as needed
};

type UserNameWithAlertProps = {
  displayName?: string | null;
  user: Auth0User | null;
  profileComplete: boolean;
  className?: string;
};

export function UserNameWithAlert({ displayName, user, profileComplete, className = "" }: UserNameWithAlertProps) {
  return (
    <span className={`ml-2 font-semibold flex items-center gap-1 ${className}`}>
      {displayName || user?.name || user?.nickname || user?.email}
      {!profileComplete && (
        <AlertCircle size={20} className="text-yellow-400 ml-1" aria-label="Profile incomplete" />
      )}
    </span>
  );
}

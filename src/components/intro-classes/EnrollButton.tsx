import React from "react";

interface EnrollButtonProps {
  isLoggedIn: boolean;
  hasSelectedVariation: boolean;
  label?: string;
  onEnrollClick: () => void;
}

export const EnrollButton: React.FC<EnrollButtonProps> = ({
  isLoggedIn,
  hasSelectedVariation,
  label = "Continue",
  onEnrollClick,
}) => {
  if (!isLoggedIn) {
    return (
      <a href={`/auth/login?returnTo=/dashboard`} className="block w-full">
        <button className="w-full bg-navy hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm">
          Sign In to Enroll
        </button>
      </a>
    );
  }

  return (
    <button
      className="w-full bg-medium-pink hover:bg-dark-red text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasSelectedVariation}
      onClick={onEnrollClick}
    >
      {label}
    </button>
  );
};

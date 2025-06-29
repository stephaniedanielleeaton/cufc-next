type SignInOutButtonProps = {
  user: any;
  onClick: () => void;
  className?: string;
};

export function SignInOutButton({ user, onClick, className = "" }: SignInOutButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-medium-pink text-white px-4 h-[58px] flex items-center uppercase tracking-widest ml-0 mr-2 ${className}`}
      aria-label={user ? "Sign out" : "Sign in"}
    >
      {user ? "Sign Out" : "Sign In"}
    </button>
  );
}

import { Menu, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { SignInOutButton } from "./SignInOutButton";
import { UserNameWithAlert } from "./UserNameWithAlert";
import { NavLinks } from "./NavLinks";
import { AdminLink } from "./AdminLink";

type Auth0User = {
  picture?: string;
  name?: string;
  nickname?: string;
  email?: string;
};

type MobileNavbarProps = {
  user: Auth0User | null;
  isAdmin: boolean;
  displayName: string | null;
  profileComplete: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  AUTH_LOGIN_PATH: string;
  AUTH_LOGOUT_PATH: string;
};

export function MobileNavbar({ user, isAdmin, displayName, profileComplete, menuOpen, setMenuOpen, AUTH_LOGIN_PATH, AUTH_LOGOUT_PATH }: MobileNavbarProps) {
  return (
    <>
      {/* Mobile Nav */}
      <nav className="md:hidden w-full h-[70px] bg-navy text-white flex items-center justify-between px-4 font-khula z-50 relative">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={28} />
        </button>
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ display: "block" }}
        >
          <Image src="/LogoAllWhite.svg" alt="CUFC Logo" width={100} height={40} />
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/pride-flag.svg" alt="Pride" width={28} height={28} />
          {user && (
            <Link href="/profile" className="block md:hidden ml-2">
              <UserAvatar picture={user.picture} alt="User Profile" size={32} className="hover:ring-2 hover:ring-blue-300 transition-all" />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
  <div className="fixed inset-0 bg-navy/90 z-50 text-white font-khula text-xl h-screen w-screen overflow-y-auto">
    <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4" aria-label="Close menu">
      <X size={32} />
    </button>
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      {/* User section at the top */}
      {user && (
        <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex flex-col items-center group">
          <UserAvatar picture={user.picture} alt="User Profile" size={40} className="group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
          <span className="mt-2 font-semibold group-hover:text-[#904F69] text-lg flex items-center gap-1">
            {displayName || user.name || user.nickname || user.email}
            {!profileComplete && (
              <AlertCircle size={20} className="text-yellow-400 ml-1" aria-label="Profile incomplete" />
            )}
          </span>
        </Link>
      )}
      <NavLinks onClick={() => setMenuOpen(false)} />
      {isAdmin && <AdminLink />}
      <SignInOutButton
        user={user}
        onClick={() => {
          window.location.href = user ? AUTH_LOGOUT_PATH : AUTH_LOGIN_PATH;
          setMenuOpen(false);
        }}
      />
    </div>
  </div>
)}
    </>
  );
}

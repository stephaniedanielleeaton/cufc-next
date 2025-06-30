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
  // add other Auth0 user fields as needed
};

type DesktopNavbarProps = {
  user: Auth0User | null;
  isAdmin: boolean;
  displayName: string | null;
  profileComplete: boolean;
  AUTH_LOGIN_PATH: string;
  AUTH_LOGOUT_PATH: string;
};

export function DesktopNavbar({ user, isAdmin, displayName, profileComplete, AUTH_LOGIN_PATH, AUTH_LOGOUT_PATH }: DesktopNavbarProps) {
  return (
    <div className="hidden md:block w-full z-40">
      <div className="h-[58px] bg-navy text-white flex items-center justify-between px-12 py-1 font-khula font-normal leading-none tracking-[.1em]">
        <Image src="/pride-flag.svg" alt="Pride" width={32} height={32} />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && <AdminLink />}
              <SignInOutButton
                user={user}
                onClick={() => {
                  window.location.href = user ? AUTH_LOGOUT_PATH : AUTH_LOGIN_PATH;
                }}
              />
              <Link href="/profile" className="flex items-center gap-3 group">
                <UserAvatar picture={user.picture} alt="User Profile" size={40} className="group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
                <UserNameWithAlert displayName={displayName} user={user} profileComplete={profileComplete} className="group-hover:text-[#904F69]" />
              </Link>
            </>
          ) : (
            <>
              <SignInOutButton
                user={null}
                onClick={() => { window.location.href = AUTH_LOGIN_PATH; }}
              />
              <UserAvatar alt="User Profile" size={40} className="group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
            </>
          )}
        </div>
      </div>
      <div className="bg-white px-12 flex items-center justify-between font-khula font-normal leading-none tracking-[.1em] text-navy py-0">
        <Link href="/">
          <div className="py-2">
            <Image src="/LogoFullColourNavy.svg" alt="CUFC Logo" width={200} height={71} />
          </div>
        </Link>
        <div className="flex gap-10">
          <NavLinks />
        </div>
      </div>
    </div>
  );
}

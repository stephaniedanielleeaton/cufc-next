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
              {user && (
                <Link href="/dashboard" className="flex items-center gap-2 group">
                  <UserAvatar picture={user.picture} alt="User Dashboard" size={32} className="group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
                  <span className="font-semibold group-hover:text-[#904F69] text-base">
                    {displayName || user.name || user.nickname || user.email}
                  </span>
                </Link>
              )}
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
      <div className="hidden md:flex justify-around items-center h-[187px] px-8 bg-white overflow-hidden">
  <div className="flex-none flex justify-center items-center bg-white h-full">
    <Link href="/">
      <Image src="/LogoFullColourNavy.svg" alt="CUFC Logo" width={200} height={71} className="w-[200px] cursor-pointer" />
    </Link>
  </div>
  <nav className="md:w-1/2 lg:w-2/3 flex items-center justify-center">
    <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
      <NavLinks />
    </div>
  </nav>
</div>
    </div>
  );
}

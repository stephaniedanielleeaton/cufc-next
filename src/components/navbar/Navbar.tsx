"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { AUTH_LOGIN_PATH, AUTH_LOGOUT_PATH } from "@/lib/auth/paths";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopNavbar } from "./DesktopNavbar";
import { useUserRoles } from "../../hooks/useUserRoles";
import { useMemberProfile } from "@/app/context/ProfileContext";

type Auth0User = {
  picture?: string;
  name?: string;
  nickname?: string;
  email?: string;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const roles = useUserRoles();
  const { profile } = useMemberProfile();
  const displayName = `${profile?.displayFirstName || ""} ${profile?.displayLastName || ""}`.trim();
  const profileComplete = profile?.profileComplete ?? false;
  const isAdmin = roles.includes("club-admin");

  

  return (
    <>
      <MobileNavbar
        user={user as Auth0User | null}
        isAdmin={isAdmin}
        displayName={displayName}
        profileComplete={profileComplete}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        AUTH_LOGIN_PATH={AUTH_LOGIN_PATH}
        AUTH_LOGOUT_PATH={AUTH_LOGOUT_PATH}
      />
      <DesktopNavbar
        user={user as Auth0User | null}
        isAdmin={isAdmin}
        displayName={displayName}
        profileComplete={profileComplete}
        AUTH_LOGIN_PATH={AUTH_LOGIN_PATH}
        AUTH_LOGOUT_PATH={AUTH_LOGOUT_PATH}
      />
    </>
  );
}

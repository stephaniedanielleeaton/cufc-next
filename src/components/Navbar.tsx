"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { AUTH_LOGIN_PATH, AUTH_LOGOUT_PATH } from "@/lib/auth/paths";
import { MobileNavbar } from "./navbar/MobileNavbar";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import { useUserRoles } from "../hooks/useUserRoles";
import { useProfileInfo } from "../hooks/useProfileInfo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const roles = useUserRoles();
  const { displayName, profileComplete } = useProfileInfo();
  const isAdmin = roles.includes("club-admin");

  function handleOpenMenu() {
    setMenuOpen(true);
  }
  function handleCloseMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <MobileNavbar
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        profileComplete={profileComplete}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        AUTH_LOGIN_PATH={AUTH_LOGIN_PATH}
        AUTH_LOGOUT_PATH={AUTH_LOGOUT_PATH}
      />
      <DesktopNavbar
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        profileComplete={profileComplete}
        AUTH_LOGIN_PATH={AUTH_LOGIN_PATH}
        AUTH_LOGOUT_PATH={AUTH_LOGOUT_PATH}
      />
    </>
  );
}

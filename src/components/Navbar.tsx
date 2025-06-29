"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function useUserRoles() {
  const { user } = useUser();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetch("/api/auth/roles");
      const data = await res.json();
      if (Array.isArray(data.roles)) {
        setRoles(data.roles);
      }
    };

    if (user) {
      fetchRoles();
    }
  }, [user]);

  return roles;
}

function useDisplayName() {
  const { user } = useUser();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const res = await fetch("/api/member/me");
        if (res.ok) {
          const data = await res.json();
          if (data.displayFirstName || data.displayLastName) {
            setDisplayName(`${data.displayFirstName ?? ''} ${data.displayLastName ?? ''}`.trim());
          }
        }
      } catch {}
    };
    if (user) {
      fetchDisplayName();
    } else {
      setDisplayName(null);
    }
  }, [user]);
  return displayName;
}


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const roles = useUserRoles();
  const displayName = useDisplayName();
  const isAdmin = roles.includes("club-admin");

  return (
    <>
      {/* Mobile Nav */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-[70px] bg-navy text-white flex items-center justify-between px-4 font-khula z-50 relative">
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
              {user.picture ? (
                <Image src={user.picture} alt="User Profile" width={32} height={32} className="rounded-full hover:ring-2 hover:ring-blue-300 transition-all" />
              ) : (
                <User size={32} className="hover:text-blue-300 transition-all" />
              )}
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-navy/90 z-50 text-white flex flex-col items-center justify-center space-y-8 font-khula text-xl">
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4" aria-label="Close menu">
            <X size={32} />
          </button>
          {/* User section at the top */}
          {user && (
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex flex-col items-center mb-4 group">
              {user.picture ? (
                <Image src={user.picture} alt="User Profile" width={40} height={40} className="rounded-full group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
              ) : (
                <User size={40} className="group-hover:text-blue-300 transition-all" />
              )}
              <span className="mt-2 font-semibold group-hover:text-[#904F69] text-lg">
                {displayName || user.name || user.nickname || user.email}
              </span>
            </Link>
          )}
          {/* Divider */}
          <div className="w-full border-t border-blue-200 opacity-40 mb-2"></div>
          <Link href="/join" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Join</Link>
          <Link href="/get-started" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Get Started</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">About</Link>
          <Link href="/events" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Events</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Contact</Link>
          <Link href="/notifications" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Notifications</Link>
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Admin</Link>}
          {user ? (
            <Link href="/auth/logout" onClick={() => setMenuOpen(false)} className="tracking-widest hover:text-[#904F69]">Log Out</Link>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:block fixed top-0 left-0 w-full z-40">
        <div className="h-[58px] bg-navy text-white flex items-center justify-between px-12 py-1 font-khula">
          <Image src="/pride-flag.svg" alt="Pride" width={32} height={32} />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-[#904F69] uppercase tracking-widest">
                    Admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      window.location.href = "/api/auth/logout";
                    }}
                    className="bg-[#904F69] text-white px-4 h-[58px] flex items-center uppercase tracking-widest ml-0 mr-2"
                    aria-label="Log out"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link href="/api/auth/login" className="bg-[#904F69] text-white px-4 h-[58px] flex items-center uppercase tracking-widest ml-0 mr-2">
                    Log In
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-3 group">
                  {user.picture ? (
                    <Image src={user.picture} alt="User Profile" width={40} height={40} className="rounded-full group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
                  ) : (
                    <User size={40} className="group-hover:text-blue-300 transition-all" />
                  )}
                  <span className="ml-2 font-semibold group-hover:text-[#904F69]">
                    {displayName || user.name || user.nickname || user.email}
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/api/auth/login" className="flex items-center gap-2 hover:text-[#904F69] uppercase tracking-widest">
                <span>Sign In</span>
                <User size={28} />
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white min-h-[80px] py-3 border-b px-12 flex items-center justify-between font-khula text-[#182A3A]">
          <Link href="/">
            <Image src="/LogoFullColourNavy.svg" alt="CUFC Logo" width={140} height={50} />
          </Link>
          <div className="flex gap-10">
            <Link href="/join" className="hover:text-[#904F69] uppercase tracking-widest">Join</Link>
            <Link href="/get-started" className="hover:text-[#904F69] uppercase tracking-widest">Get Started</Link>
            <Link href="/about" className="hover:text-[#904F69] uppercase tracking-widest">About</Link>
            <Link href="/events" className="hover:text-[#904F69] uppercase tracking-widest">Events</Link>
            <Link href="/contact" className="hover:text-[#904F69] uppercase tracking-widest">Contact</Link>
            <Link href="/notifications" className="hover:text-[#904F69] uppercase tracking-widest">Notifications</Link>
          </div>
        </div>
      </div>
    </>
  );
}

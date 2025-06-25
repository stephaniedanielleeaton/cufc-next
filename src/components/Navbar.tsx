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
      <nav className="md:hidden fixed top-0 left-0 w-full h-[70px] bg-navy text-white flex items-center justify-between px-4 font-khula z-50">
        <button onClick={() => setMenuOpen(true)}>
          <Menu size={28} />
        </button>
        <Link href="/">
          <Image src="/LogoAllWhite.svg" alt="CUFC Logo" width={100} height={40} />
        </Link>
        <Image src="/pride-flag.svg" alt="Pride" width={28} height={28} />
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-navy/90 z-50 text-white flex flex-col items-center justify-center space-y-8 font-khula text-xl">
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4">
            <X size={32} />
          </button>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/classes" onClick={() => setMenuOpen(false)}>Classes</Link>
          <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <Link href="/auth/logout" onClick={() => setMenuOpen(false)}>Log Out</Link>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}

      {/* Desktop Nav */}
      <div className="hidden md:block fixed top-0 left-0 w-full z-40">
        <div className="h-[70px] bg-navy text-white flex items-center justify-between px-12 font-khula">
          <Image src="/pride-flag.svg" alt="Pride" width={32} height={32} />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && <Link href="/admin" className="hover:underline">Admin</Link>}
                <Link href="/profile" className="flex items-center gap-3 group">
                  {user.picture ? (
                    <Image src={user.picture} alt="User Profile" width={40} height={40} className="rounded-full group-hover:ring-2 group-hover:ring-blue-300 transition-all" />
                  ) : (
                    <User size={40} className="group-hover:text-blue-300 transition-all" />
                  )}
                  <span className="ml-2 font-semibold group-hover:underline">
                    {displayName || user.name || user.nickname || user.email}
                  </span>
                </Link>
                <Link href="/auth/logout" className="hover:underline">Log Out</Link>
              </>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2 hover:underline">
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
          <div className="flex gap-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/classes" className="hover:underline">Classes</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </>
  );
}

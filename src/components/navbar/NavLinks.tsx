import Link from "next/link";

export const NAV_LINKS = [
  { href: "/join", label: "Join" },
  { href: "/get-started", label: "Get Started" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
  { href: "/notifications", label: "Notifications" },
];

type NavLinksProps = {
  onClick?: () => void;
  className?: string;
};

export function NavLinks({ onClick, className = "" }: NavLinksProps) {
  return (
    <>
      {NAV_LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`hover:text-[#904F69] uppercase tracking-widest ${className}`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

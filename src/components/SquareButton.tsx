import React from "react";
import Link from "next/link";

interface SquareButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SquareButton({ href, children, className = "", style }: SquareButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-8 py-2 bg-transparent text-white font-semibold text-lg border-2 border-white rounded-none shadow-md transition hover:bg-white/10 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 tracking-widest ${className}`.trim()}
      style={{ minWidth: 120, height: 48, ...style }}
    >
      {children}
    </Link>
  );
}

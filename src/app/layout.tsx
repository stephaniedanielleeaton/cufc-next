import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { MemberProfileProvider } from "@/app/context/ProfileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Columbus United Fencing Club",
  description:
    "Columbus United Fencing Club, an inclusive historical fencing club in Columbus, Ohio. Join us to learn, improve, and compete in Historical European Martial Arts.",
  keywords:
    "Columbus United Fencing Club, Historical European Martial Arts, HEMA, fencing club Columbus, learn fencing Ohio, fencing fitness, fencing community",
  openGraph: {
    title: "Columbus United Fencing Club",
    description:
      "Columbus United Fencing Club, an inclusive historical fencing and HEMA club in Columbus, Ohio. Join us to learn, improve, and compete in Historical European Martial Arts.",
    url: "http://columbusunitedfencing.com/",
    siteName: "Columbus United Fencing Club",
    images: [
      {
        url: "/LogoFullColourNavy.svg",
        width: 512,
        height: 512,
        alt: "Columbus United Fencing Club Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/LogoFullColourNavy.svg",
        alt: "Columbus United Fencing Club Logo",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/LogoFullColourNavy.svg",
  },
  manifest: "/manifest.json",
};


export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MemberProfileProvider>
        <Navbar />
        <div>{children}</div>
        </MemberProfileProvider>
      </body>
    </html>
  );
}

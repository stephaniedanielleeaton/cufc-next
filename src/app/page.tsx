"use client";

import { useUser } from "@auth0/nextjs-auth0";

import Image from "next/image";

export default function Home() {

  const { user, isLoading } = useUser();

  return (
    <>
    </>
  );
}

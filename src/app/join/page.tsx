"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { UnauthenticatedView } from "@/components/join/UnauthenticatedView";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JoinPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medium-pink"></div>
      </div>
    );
  }

  if (!user) {
    return <UnauthenticatedView />;
  }

  return null;
}

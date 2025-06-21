"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";

export default function Home() {
  const [backendValue, setBackendValue] = useState<string>("");
  const frontendValue = process.env.NEXT_PUBLIC_TEST_FRONTEND_VALUE || "";

  const { user, isLoading } = useUser();
  const router = useRouter();

  // Fetch backend test value
  useEffect(() => {
    fetch("/api/test-value")
      .then((res) => res.json())
      .then((data) => setBackendValue(data.value || ""));
  }, []);

  // Redirect to profile if logged in
  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans">
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900 w-full max-w-md mb-4">
        <div><strong>Backend value from .env:</strong> {backendValue}</div>
        <div><strong>Frontend value from .env:</strong> {frontendValue}</div>
      </div>

      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900 w-full max-w-md mb-4">
        <strong>Auth0 User State:</strong>
        {isLoading ? (
          <div>Loading...</div>
        ) : user ? (
          <div>Redirecting to your profile...</div>
        ) : (
          <a href="/auth/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
            Log in to Join the Gym
          </a>
        )}
      </div>
    </div>
  );
}

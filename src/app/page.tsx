"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  const [backendValue, setBackendValue] = useState<string>("");
  const frontendValue = process.env.NEXT_PUBLIC_TEST_FRONTEND_VALUE || "";

  const { user, isLoading } = useUser();

  // Fetch backend test value
  useEffect(() => {
    fetch("/api/test-value")
      .then((res) => res.json())
      .then((data) => setBackendValue(data.value || ""));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans mt-[130px]">
        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900 w-full max-w-md mb-4">
          <div><strong>Backend value from .env:</strong> {backendValue}</div>
          <div><strong>Frontend value from .env:</strong> {frontendValue}</div>
        </div>

        <div className="bg-medium-pink p-4 border rounded">
        Hello
      </div>

        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900 w-full max-w-md mb-4">
          <strong>Auth0 User State:</strong>
          {isLoading ? (
            <div>Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-bold">{user.name}</span>
                <a
                  href="/profile"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Go to Profile
                </a>
              </div>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
              Log in to Join the Gym
            </a>
          )}
        </div>
      </div>
    </>
  );
}

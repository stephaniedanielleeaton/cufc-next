"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home() {
  const [backendValue, setBackendValue] = useState<string>("");
  const frontendValue = process.env.NEXT_PUBLIC_TEST_FRONTEND_VALUE || "";

  useEffect(() => {
    fetch("/api/test-value")
      .then((res) => res.json())
      .then((data) => setBackendValue(data.value || ""));
  }, []);

  const { user, isLoading } = useUser();

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
          <div>
            <div>Welcome, {user.name}!</div>
            <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{JSON.stringify(user, null, 2)}</pre>
            <a href="/auth/logout" className="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded">Log out</a>
          </div>
        ) : (
          <a href="/auth/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Log in</a>
        )}
      </div>
    </div>
  );
}

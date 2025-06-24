import { auth0 } from "@/lib/auth/auth0";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { token: accessToken } = await auth0.getAccessToken();
  
  if (typeof accessToken !== "string") {
    throw new Error("Invalid access token");
  }
  const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());

  const roles = payload["https://cufc.app/roles"] || [];
  if (!roles.includes("club-admin")) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-12">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome, club administrator!</p>
    </main>
  );
}

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(request: Request) {
  const session = await auth0.getSession(request);
  const user = session?.user;
  const roles = user && (user["https://your-app.example.com/roles"] || user.roles || []);

  if (!user || !roles.includes("admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Your protected logic here
  return NextResponse.json({ message: "Welcome, admin!" });
}

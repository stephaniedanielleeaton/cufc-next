import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";

export async function requireRole(requiredRoles: string | string[]) {
  const session = await auth0.getSession();
  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  const { token: accessToken } = await auth0.getAccessToken();
  if (typeof accessToken !== "string") {
    return { error: "Invalid access token", status: 401 };
  }
  const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
  const roles = payload["https://cufc.app/roles"] || [];

  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  if (!required.some(role => roles.includes(role))) {
    return { error: "Forbidden", status: 403 };
  }

  return { session, roles };
}
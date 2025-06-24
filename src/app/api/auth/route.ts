import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth/auth0";

// GET handler for Auth0 SDK routes
export async function GET(req: NextRequest) {
  return auth0.middleware(req);
}

// POST handler for Auth0 SDK routes
export async function POST(req: NextRequest) {
  return auth0.middleware(req);
}
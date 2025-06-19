// For Auth0 v4.6.1, we need to create App Router compatible route handlers
import { NextRequest } from "next/server";
import { auth0 } from "../../../../lib/auth0";

// Route handler for GET requests
export async function GET(req: NextRequest) {
  return auth0.middleware(req);
}

// Route handler for POST requests
export async function POST(req: NextRequest) {
  return auth0.middleware(req);
}

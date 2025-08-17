import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
    audience: "columbusunitedfencing.com",
  },
  routes: {
    callback: "/api/auth/callback",
    login: "/api/auth/login",
    postLoginRedirect: "/dashboard"
  },
});

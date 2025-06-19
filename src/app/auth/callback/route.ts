import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the authorization code from the request
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
    }
    
    // Exchange the code for tokens
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.APP_BASE_URL}/auth/callback`
      })
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 500 });
    }
    
    // Create the response with redirect
    const redirectUrl = new URL(url.searchParams.get('state') || '/', process.env.APP_BASE_URL);
    const response = NextResponse.redirect(redirectUrl);
    
    // Set cookies in the response
    response.cookies.set('auth_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expires_in,
      path: '/'
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
    }
    
    return response;
    
    // The redirect is handled above when creating the response with cookies
  } catch (error) {
    console.error('Authentication callback error:', error);
    return NextResponse.json({ error: "Authentication callback failed" }, { status: 500 });
  }
}

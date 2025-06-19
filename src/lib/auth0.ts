// Auth0 SDK v4.6.1 integration for Next.js App Router
import { NextRequest, NextResponse } from 'next/server';

// Simple helper functions for Auth0 authentication
export const auth0 = {
  // Simple middleware that passes through requests
  middleware: async (_req: NextRequest) => {
    return NextResponse.next();
  },
  
  // Get the current session from our custom /api/auth/me endpoint
  getSession: async (req: Request) => {
    try {
      // Make a server-side request to our auth/me endpoint
      const response = await fetch(new URL('/api/auth/me', req.url).toString(), {
        headers: {
          cookie: req.headers.get('cookie') || ''
        }
      });
      
      if (!response.ok) {
        return { user: null };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get session', error);
      return { user: null };
    }
  },
  
  // Helper for redirecting to login
  login: (returnTo?: string) => {
    const url = new URL('/api/auth/login', process.env.APP_BASE_URL || 'http://localhost:3000');
    if (returnTo) {
      url.searchParams.set('returnTo', returnTo);
    }
    return NextResponse.redirect(url);
  },
  
  // Helper for redirecting to logout
  logout: (returnTo?: string) => {
    const url = new URL('/api/auth/logout', process.env.APP_BASE_URL || 'http://localhost:3000');
    if (returnTo) {
      url.searchParams.set('returnTo', returnTo);
    }
    return NextResponse.redirect(url);
  }
};

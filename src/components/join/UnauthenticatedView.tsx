"use client";

import Link from "next/link";
import { AUTH_LOGIN_PATH } from "@/lib/auth/paths";

export function UnauthenticatedView() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Join Us</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Ready to Join?</h2>
        <p className="mb-4">
          To start the application process, please sign in or create an account first.
        </p>
        
        <div className="flex justify-center">
          <Link 
            href={AUTH_LOGIN_PATH}
            className="bg-medium-pink hover:bg-dark-red text-white font-bold py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Create Account
          </Link>
        </div>
      </div>
    
    </div>
  );
}

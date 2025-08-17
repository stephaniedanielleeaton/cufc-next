"use client";

import React, { useState } from 'react';
import { useIntroClassOfferings } from '@/hooks/useIntroClassOfferings';
import { useMemberProfile } from '@/app/context/ProfileContext';
import { useUser } from '@auth0/nextjs-auth0';

export const IntroClassOfferings: React.FC = () => {
  const { introClassData, isLoading, error } = useIntroClassOfferings();
  const { user, isLoading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useMemberProfile();
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (isLoading || userLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medium-pink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Unable to load class information. Please try again later.</p>
      </div>
    );
  }

  if (!introClassData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>No class information available at this time.</p>
      </div>
    );
  }

  const hasAvailableSpots = introClassData.variations?.some(variation => 
    parseInt(variation.quantity || '0') > 0
  );
  
  const isLoggedIn = !!user;
  const hasCompleteProfile = !!profile?.profileComplete;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-navy p-3 text-center">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          Upcoming Intro Classes for New Fencers
        </h2>
      </div>
      <div className="p-4">
        {introClassData.variations && introClassData.variations.length > 0 ? (
          <div className="space-y-2">
            {introClassData.variations.map((variation) => (
              <div 
                key={variation.id} 
                className={`border rounded-md p-3 flex justify-between items-center cursor-pointer ${parseInt(variation.quantity || '0') > 0 ? 'hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'} ${selectedVariationId === variation.id ? 'border-medium-pink bg-pink-50' : 'border-gray-200'}`}
                onClick={() => {
                  if (parseInt(variation.quantity || '0') > 0) {
                    setSelectedVariationId(variation.id === selectedVariationId ? null : variation.id);
                  }
                }}
              >
                <div>
                  <p className="font-medium text-sm">{variation.name}</p>
                  <p className="text-xs text-gray-500">
                    {parseInt(variation.quantity || '0') > 0 
                      ? `${variation.quantity} spots available` 
                      : 'Class full'}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                    parseInt(variation.quantity || '0') > 0 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}></div>
                  {selectedVariationId === variation.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medium-pink" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No class dates available at this time.</p>
        )}
        
        <div className="mt-4">
          {!isLoggedIn ? (
            <a href="/api/auth/login" className="block w-full">
              <button 
                className="w-full bg-navy hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <span className="mr-2">Sign In to Enroll</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </a>
          ) : !hasCompleteProfile ? (
            <a href="/profile" className="block w-full">
              <button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <span className="mr-2">Complete Profile to Enroll</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </a>
          ) : (
            <button 
              className="w-full bg-medium-pink hover:bg-dark-red text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              disabled={!selectedVariationId || isProcessing}
              onClick={async () => {
                if (!selectedVariationId || !profile?.profileId) return;
                
                try {
                  setIsProcessing(true);
                  setCheckoutError(null);
                  
                  const response = await fetch('/api/checkout/intro', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      catalogObjectId: selectedVariationId,
                      memberProfileId: profile.profileId,
                    }),
                  });
                  
                  const data = await response.json();
                  
                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to create checkout');
                  }
                  
                
                  window.location.href = data.checkoutUrl;
                } catch (error) {
                  console.error('Error creating checkout:', error);
                  setCheckoutError(error instanceof Error ? error.message : 'An error occurred');
                } finally {
                  setIsProcessing(false);
                }
              }}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="mr-2">Enroll Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          )}
          {isLoggedIn && hasCompleteProfile && (
            <div className="mt-1">
              {!selectedVariationId && (
                <p className="text-xs text-center text-gray-500">
                  Please select a class date above
                </p>
              )}
              {checkoutError && (
                <p className="text-xs text-center text-red-500 mt-1">
                  Error: {checkoutError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

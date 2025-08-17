"use client";

import React, { useState } from 'react';
import { useIntroClassOfferings } from '@/hooks/useIntroClassOfferings';
import { useMemberProfile } from '@/app/context/ProfileContext';
import { useUser } from '@auth0/nextjs-auth0';
import { ClassVariationItem } from './ClassVariationItem';
import { EnrollButton } from './EnrollButton';

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
          <ul className="space-y-2" aria-label="Available Intro Classes">
            {introClassData.variations.map((variation) => (
              <ClassVariationItem
                key={variation.id}
                variation={variation}
                isSelected={selectedVariationId === variation.id}
                onSelect={() => setSelectedVariationId(variation.id === selectedVariationId ? null : variation.id)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No class dates are available right now.</p>
        )}
        
        <div className="mt-4">
          <EnrollButton
            isLoggedIn={isLoggedIn}
            hasCompleteProfile={hasCompleteProfile}
            isProcessing={isProcessing}
            hasSelectedVariation={!!selectedVariationId}
            onEnrollClick={async () => {
              if (!selectedVariationId || !profile?.profileId) return;
              try {
                setIsProcessing(true);
                setCheckoutError(null);
                const response = await fetch('/api/checkout/intro', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
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
          />
          {isLoggedIn && hasCompleteProfile && (
            <div className="mt-1">
              {!selectedVariationId && (
                <p className="text-xs text-center text-gray-500">
                  Select a class date to continue.
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

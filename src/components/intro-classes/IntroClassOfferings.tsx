"use client";

import React from 'react';
import { useIntroClassOfferings } from '@/hooks/useIntroClassOfferings';
import { VariationDTO } from '@/types/IntroClassDTO';

export const IntroClassOfferings: React.FC = () => {
  const { introClassData, isLoading, error } = useIntroClassOfferings();

  if (isLoading) {
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
                className="border border-gray-200 rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">{variation.name}</p>
                  <p className="text-xs text-gray-500">
                    {parseInt(variation.quantity || '0') > 0 
                      ? `${variation.quantity} spots available` 
                      : 'Class full'}
                  </p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  parseInt(variation.quantity || '0') > 0 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No class dates available at this time.</p>
        )}
        
        <div className="mt-4">
          <button 
            className="w-full bg-medium-pink hover:bg-dark-red text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
            disabled={!hasAvailableSpots}
          >
            <span className="mr-2">Enroll Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <p className="text-xs text-center text-gray-500 mt-1">
            You'll select your preferred date at checkout
          </p>
        </div>
      </div>
    </div>
  );
};

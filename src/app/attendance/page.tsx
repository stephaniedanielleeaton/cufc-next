"use client";

import React, { useEffect, useState } from "react";
// Use the correct type for members as returned by the attendance API
export type MemberProfileCheckIn = {
  id: string;
  displayFirstName?: string;
  displayLastName?: string;
  isCheckedIn: boolean;
};

import { useToggleAttendance } from "@/hooks/useToggleAttendance";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

async function fetchMembers(): Promise<MemberProfileCheckIn[]> {
  const res = await fetch("/api/attendance/members");
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export default function AttendancePage() {
  const [members, setMembers] = useState<MemberProfileCheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const toggleAttendance = useToggleAttendance();

  useEffect(() => {
    fetchMembers()
      .then(setMembers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedLetter("");
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(prev => (prev === letter ? "" : letter));
    setSearchTerm("");
  };

  const handleCheckIn = async (memberId: string) => {
    try {
      console.log("Toggling attendance for member ID:", memberId);
      const checkedIn = await toggleAttendance(memberId);
      setMembers(members =>
        members.map(m =>
          m.id === memberId ? { ...m, isCheckedIn: checkedIn } : m
        )
      );
    } catch (e: any) {
      console.error("Check-in error:", e);
      setError(e.message);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedLetter("");
  };

  // Calculate total checked in
  const totalCheckedIn = members.filter(m => m.isCheckedIn).length;

  // Get available letters for the alphabet filter
  const availableLetters = Array.from(
    new Set(members.map(m => (m.displayLastName || "").charAt(0).toUpperCase()).filter(Boolean))
  );

  // Apply filters based on checkboxes and search
  let filteredMembers = [...members];
  
  if (searchTerm) {
    filteredMembers = filteredMembers.filter(
      m =>
        (m.displayFirstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.displayLastName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (selectedLetter) {
    filteredMembers = filteredMembers.filter(
      m => (m.displayLastName || "").charAt(0).toUpperCase() === selectedLetter
    );
  }

  
  // Sort by last name
  filteredMembers = filteredMembers.sort((a, b) =>
    (a.displayLastName || "").localeCompare(b.displayLastName || "")
  );

  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-40">
      <div className="flex flex-row justify-center w-full">
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-between pl-4 mt-2">
            <h1 className="text-2xl font-bold text-deep-sea-blue">Fencer Check-In</h1>
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-600">Total Checked In:</div>
              <div className="ml-2 text-lg font-semibold text-deep-sea-blue">{totalCheckedIn}</div>
            </div>
          </div>
          <div className="p-4 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center flex-grow mr-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg 
                      className="w-4 h-4 text-hover-outer-space" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="border border-deep-sea-blue text-hover-outer-space text-sm rounded-lg block w-full ps-10 p-2.5 focus:outline-none"
                    placeholder="Enter Name..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </span>
            </div>
            


            <div className="flex flex-wrap gap-3 mb-6">
              {ALPHABET.map(letter => {
                const isAvailable = availableLetters.includes(letter);
                const isSelected = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={!isAvailable}
                    className={`
                      w-16 h-14 rounded-lg text-2xl font-medium 
                      transition-all duration-200 ease-in-out
                      ${isSelected
                        ? "bg-deep-sea-blue text-white font-bold shadow-md"
                        : isAvailable
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
              {(selectedLetter || searchTerm) && (
                <button
                  onClick={handleClearFilters}
                  className="w-auto px-4 h-14 rounded-lg text-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 ease-in-out flex items-center gap-2"
                >
                  Clear Filter
                  <span className="text-xl">×</span>
                </button>
              )}
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            
            <div className="grid grid-cols-1 gap-3 mt-4">
              {filteredMembers.map((member, index) => (
                <div key={member.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <div 
                    className={`flex items-center p-4 shadow-sm rounded-lg cursor-pointer border ${
                      !member.isCheckedIn ? "bg-white hover:bg-gray-50 border-gray-200" : ""
                    }`}
                    style={member.isCheckedIn ? {
                      backgroundColor: "var(--color-medium-pink)",
                      borderColor: "var(--color-dark-red)",
                      color: "var(--color-light-gray)"
                    } : {}}
                    onClick={() => handleCheckIn(member.id)}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!member.isCheckedIn ? "bg-gray-300" : ""}`}
                      style={member.isCheckedIn ? {backgroundColor: "var(--color-dark-red)"} : {}}>
                    
                      {member.isCheckedIn && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className={`text-xl ${member.isCheckedIn ? "text-white" : "text-gray-900"}`}>
                        <span className="font-normal">{(member.displayLastName || "").trim()}, </span>
                        <span className="font-bold">{(member.displayFirstName || "").trim()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

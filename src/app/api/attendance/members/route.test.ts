/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { GET } from './route';
import { getMembersWithCheckInStatus } from '@/lib/services/attendance/getMembersWithCheckInStatus';
import { dbConnect } from '@/lib/mongoose';

jest.mock('@/lib/services/attendance/getMembersWithCheckInStatus', () => ({
  getMembersWithCheckInStatus: jest.fn(),
}));

jest.mock('@/lib/mongoose', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
}));

describe('GET /api/attendance/members', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return members with check-in status successfully', async () => {
    const mockMembers = [
      { 
        id: 'user1', 
        displayFirstName: 'John', 
        displayLastName: 'Doe', 
        isCheckedIn: true 
      },
      { 
        id: 'user2', 
        displayFirstName: 'Jane', 
        displayLastName: 'Smith', 
        isCheckedIn: false 
      }
    ];
    
    (getMembersWithCheckInStatus as jest.Mock).mockResolvedValue(mockMembers);
    
    const response = await GET();
    
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual(mockMembers);
    expect(dbConnect).toHaveBeenCalled();
    expect(getMembersWithCheckInStatus).toHaveBeenCalled();
  });

  it('should return 500 when service throws an error', async () => {
    const mockError = new Error('Database error');
    (getMembersWithCheckInStatus as jest.Mock).mockRejectedValue(mockError);
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const response = await GET();
    
    expect(response.status).toBe(500);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Internal Server Error' });
    expect(dbConnect).toHaveBeenCalled();
    expect(getMembersWithCheckInStatus).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});

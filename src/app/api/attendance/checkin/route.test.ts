/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { POST } from './route';
import { checkInMember } from '@/lib/services/attendance/checkIn';
import { dbConnect } from '@/lib/mongoose';

jest.mock('@/lib/services/attendance/checkIn', () => ({
  checkInMember: jest.fn(),
}));

jest.mock('@/lib/mongoose', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
}));

describe('POST /api/attendance/checkin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check in a member successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ memberId: 'user123' })
    } as unknown as Request;
    
    const mockCheckInResponse = { checkedIn: true, attendance: { _id: 'a1', userId: 'user123' } };
    (checkInMember as jest.Mock).mockResolvedValue(mockCheckInResponse);
    
    const response = await POST(mockRequest);
    
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual(mockCheckInResponse);
    expect(dbConnect).toHaveBeenCalled();
    expect(checkInMember).toHaveBeenCalledWith('user123');
  });

  it('should return 400 when memberId is missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({})
    } as unknown as Request;
    
    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Missing memberId' });
    expect(dbConnect).toHaveBeenCalled();
    expect(checkInMember).not.toHaveBeenCalled();
  });

  it('should return 500 when service throws an error', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ memberId: 'user123' })
    } as unknown as Request;
    
    const mockError = new Error('Database error');
    (checkInMember as jest.Mock).mockRejectedValue(mockError);
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const response = await POST(mockRequest);
    
    expect(response.status).toBe(500);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: 'Internal Server Error' });
    expect(dbConnect).toHaveBeenCalled();
    expect(checkInMember).toHaveBeenCalledWith('user123');
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});

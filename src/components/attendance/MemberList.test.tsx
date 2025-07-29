import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemberList } from './MemberList';
import { MemberCheckIn } from '@/lib/types/MemberCheckIn';

jest.mock('./MemberCard', () => ({
  MemberCard: ({ member, onCheckIn }: { member: MemberCheckIn, onCheckIn: (id: string) => void }) => (
    <div data-testid={`member-card-${member.id}`} onClick={() => onCheckIn(member.id)}>
      {member.displayLastName}, {member.displayFirstName}
    </div>
  )
}));

describe('MemberList Component', () => {
  const mockOnCheckIn = jest.fn();
  
  beforeEach(() => {
    mockOnCheckIn.mockReset();
  });

  test('renders loading state', () => {
    render(
      <MemberList 
        members={[]} 
        onCheckIn={mockOnCheckIn} 
        loading={true} 
      />
    );
    
    expect(screen.getByText('Loading members...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to load members';
    
    render(
      <MemberList 
        members={[]} 
        onCheckIn={mockOnCheckIn} 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders empty state when no members', () => {
    render(
      <MemberList 
        members={[]} 
        onCheckIn={mockOnCheckIn} 
      />
    );
    
    expect(screen.getByText('No members found')).toBeInTheDocument();
  });

  test('renders list of members', () => {
    const members: MemberCheckIn[] = [
      {
        id: '1',
        displayFirstName: 'John',
        displayLastName: 'Doe',
        isCheckedIn: false
      },
      {
        id: '2',
        displayFirstName: 'Jane',
        displayLastName: 'Smith',
        isCheckedIn: true
      }
    ];
    
    render(
      <MemberList 
        members={members} 
        onCheckIn={mockOnCheckIn} 
      />
    );
    
    expect(screen.getByTestId('member-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('member-card-2')).toBeInTheDocument();
  });

  test('applies alternating background colors to rows', () => {
    const members: MemberCheckIn[] = [
      {
        id: '1',
        displayFirstName: 'John',
        displayLastName: 'Doe',
        isCheckedIn: false
      },
      {
        id: '2',
        displayFirstName: 'Jane',
        displayLastName: 'Smith',
        isCheckedIn: true
      }
    ];
    
    const { container } = render(
      <MemberList 
        members={members} 
        onCheckIn={mockOnCheckIn} 
      />
    );
    
    const rows = container.querySelectorAll('.grid > div');
    expect(rows[0]).toHaveClass('bg-white');
    expect(rows[1]).toHaveClass('bg-gray-50');
  });
});

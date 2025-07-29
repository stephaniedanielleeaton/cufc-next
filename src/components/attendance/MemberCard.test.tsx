import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemberCard } from './MemberCard';
import { MemberCheckIn } from '@/types/MemberCheckIn';

describe('MemberCard Component', () => {
  const mockOnCheckIn = jest.fn();
  
  beforeEach(() => {
    mockOnCheckIn.mockReset();
  });

  test('renders member name in lastname, firstname format', () => {
    const member: MemberCheckIn = {
      id: '1',
      displayFirstName: 'John',
      displayLastName: 'Doe',
      isCheckedIn: false
    };

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);
    
    const lastNameElement = screen.getByText(/Doe,/i);
    const firstNameElement = screen.getByText(/John/i);
    expect(lastNameElement).toBeInTheDocument();
    expect(firstNameElement).toBeInTheDocument();
  });

  test('renders checked-in member with correct styling', () => {
    const member: MemberCheckIn = {
      id: '1',
      displayFirstName: 'John',
      displayLastName: 'Doe',
      isCheckedIn: true
    };

    const { container } = render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);
    
    const cardElement = container.querySelector('div[class*="flex items-center"]');
    expect(cardElement).not.toBeNull();
    
    if (cardElement) {
      expect(cardElement).toHaveStyle({
        backgroundColor: 'var(--color-medium-pink)',
        color: 'var(--color-light-gray)'
      });
      
      expect(cardElement.getAttribute('style')).toContain('border-color: var(--color-dark-red)');
    }
    
    const checkmarkIcon = container.querySelector('svg');
    expect(checkmarkIcon).toBeInTheDocument();
  });

  test('renders non-checked-in member with default styling', () => {
    const member: MemberCheckIn = {
      id: '1',
      displayFirstName: 'John',
      displayLastName: 'Doe',
      isCheckedIn: false
    };

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);
    
    const cardElement = screen.getByText(/Doe,/i).closest('div[class*="flex items-center"]');
    expect(cardElement).toHaveClass('bg-white');
    expect(cardElement).toHaveClass('hover:bg-gray-50');
    expect(cardElement).toHaveClass('border-gray-200');
    
    const avatarContainer = screen.getByText(/Doe,/i).closest('div[class*="flex items-center"]')?.firstChild;
    expect(avatarContainer).toHaveClass('bg-gray-300');
    
    const checkmarkIcon = screen.queryByRole('img', { hidden: true });
    expect(checkmarkIcon).not.toBeInTheDocument();
  });

  test('calls onCheckIn with member id when clicked', () => {
    const member: MemberCheckIn = {
      id: '1',
      displayFirstName: 'John',
      displayLastName: 'Doe',
      isCheckedIn: false
    };

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);
    
    const cardElement = screen.getByText(/Doe,/i).closest('div[class*="flex items-center"]');
    if (!cardElement) throw new Error('Card element not found');
    fireEvent.click(cardElement);
    
    expect(mockOnCheckIn).toHaveBeenCalledTimes(1);
    expect(mockOnCheckIn).toHaveBeenCalledWith('1');
  });

  test('handles members with missing name fields', () => {
    const member: MemberCheckIn = {
      id: '1',
      displayFirstName: '',
      displayLastName: '',
      isCheckedIn: false
    };

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);
    
    const nameElement = screen.getByText(',');
    expect(nameElement).toBeInTheDocument();
  });
});

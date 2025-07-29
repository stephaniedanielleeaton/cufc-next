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

  const createMember = (overrides: Partial<MemberCheckIn> = {}): MemberCheckIn => ({
    id: '1',
    displayFirstName: 'John',
    displayLastName: 'Doe',
    isCheckedIn: false,
    ...overrides,
  });

  test('renders member name in lastname, firstname format', () => {
    const member = createMember();

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);

    expect(screen.getByText(/Doe,/i)).toBeInTheDocument();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
  });

  test('renders checked-in member with correct styling and aria-pressed', () => {
    const member = createMember({ isCheckedIn: true });

    const { container } = render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);

    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveStyle({
      backgroundColor: 'var(--color-medium-pink)',
      color: 'var(--color-light-gray)',
    });
    expect(button?.getAttribute('style')).toContain('border-color: var(--color-dark-red)');

    const checkmarkIcon = container.querySelector('svg');
    expect(checkmarkIcon).toBeInTheDocument();
  });

  test('renders non-checked-in member with default classes and aria-pressed', () => {
    const member = createMember();

    const { container } = render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);

    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('hover:bg-gray-50');
    expect(button).toHaveClass('border-gray-200');

    const avatarContainer = button?.querySelector('div');
    expect(avatarContainer).toHaveClass('bg-gray-300');

    const checkmarkIcon = container.querySelector('svg');
    expect(checkmarkIcon).not.toBeInTheDocument();
  });

  test('calls onCheckIn with member id when clicked', () => {
    const member = createMember();

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnCheckIn).toHaveBeenCalledTimes(1);
    expect(mockOnCheckIn).toHaveBeenCalledWith('1');
  });

  test('handles members with missing name fields', () => {
    const member = createMember({ displayFirstName: '', displayLastName: '' });

    render(<MemberCard member={member} onCheckIn={mockOnCheckIn} />);

    const nameElement = screen.getByText(',');
    expect(nameElement).toBeInTheDocument();
  });
});

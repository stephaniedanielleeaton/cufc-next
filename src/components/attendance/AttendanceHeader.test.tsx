import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttendanceHeader } from './AttendanceHeader';

describe('AttendanceHeader Component', () => {
  test('renders title correctly', () => {
    render(<AttendanceHeader title="Member Attendance" totalCheckedIn={0} />);
    
    const titleElement = screen.getByText('Member Attendance');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('text-2xl');
    expect(titleElement).toHaveClass('font-bold');
    expect(titleElement).toHaveClass('text-deep-sea-blue');
  });

  test('renders total checked in count correctly', () => {
    const checkedInCount = 42;
    render(<AttendanceHeader title="Member Attendance" totalCheckedIn={checkedInCount} />);
    
    const labelElement = screen.getByText('Total Checked In:');
    expect(labelElement).toBeInTheDocument();
    
    const countElement = screen.getByText('42');
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveClass('text-lg');
    expect(countElement).toHaveClass('font-semibold');
    expect(countElement).toHaveClass('text-deep-sea-blue');
  });

  test('renders zero checked in count correctly', () => {
    render(<AttendanceHeader title="Member Attendance" totalCheckedIn={0} />);
    
    const countElement = screen.getByText('0');
    expect(countElement).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<AttendanceHeader title="Custom Title" totalCheckedIn={5} />);
    
    const titleElement = screen.getByText('Custom Title');
    expect(titleElement).toBeInTheDocument();
  });

  test('has correct layout structure', () => {
    const { container } = render(
      <AttendanceHeader title="Member Attendance" totalCheckedIn={10} />
    );
    
    const headerContainer = container.firstChild;
    expect(headerContainer).toHaveClass('flex');
    expect(headerContainer).toHaveClass('items-center');
    expect(headerContainer).toHaveClass('justify-between');
    
    const countContainer = screen.getByText('Total Checked In:').parentElement;
    expect(countContainer).toHaveClass('flex');
    expect(countContainer).toHaveClass('items-center');
  });
});

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttendancePage from './page';

jest.mock('@/components/attendance/SearchBar', () => ({
  SearchBar: ({ searchTerm, onSearch, placeholder }: any) => (
    <div data-testid="mock-search-bar">
      <input 
        data-testid="search-input" 
        value={searchTerm} 
        onChange={onSearch} 
        placeholder={placeholder} 
      />
    </div>
  )
}));

jest.mock('@/components/attendance/AlphabetFilter', () => ({
  AlphabetFilter: ({ availableLetters, selectedLetter, onLetterClick, onClearFilter }: any) => (
    <div data-testid="mock-alphabet-filter">
      {availableLetters.map((letter: string) => (
        <button 
          key={letter} 
          data-testid={`letter-${letter}`} 
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </button>
      ))}
      {onClearFilter && (
        <button data-testid="clear-filter" onClick={onClearFilter}>Clear</button>
      )}
    </div>
  )
}));

jest.mock('@/components/attendance/AttendanceHeader', () => ({
  AttendanceHeader: ({ title, totalCheckedIn }: any) => (
    <div data-testid="mock-attendance-header">
      <h1>{title}</h1>
      <span data-testid="total-checked-in">{totalCheckedIn}</span>
    </div>
  )
}));

jest.mock('@/components/attendance/MemberList', () => ({
  MemberList: ({ members, onCheckIn, loading, error }: any) => (
    <div data-testid="mock-member-list">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {!loading && !error && members.length === 0 && (
        <div data-testid="empty">No members found</div>
      )}
      {!loading && !error && members.map((member: any) => (
        <div 
          key={member.id} 
          data-testid={`member-${member.id}`}
          data-checked={member.isCheckedIn}
          onClick={() => onCheckIn(member.id)}
        >
          {member.displayLastName}, {member.displayFirstName}
        </div>
      ))}
    </div>
  )
}));

jest.mock('@/hooks/useToggleAttendance', () => ({
  useToggleAttendance: () => jest.fn().mockImplementation(async (memberId) => {
    return true;
  })
}));

global.fetch = jest.fn();

const mockMembers = [
  { id: '1', displayFirstName: 'John', displayLastName: 'Doe', isCheckedIn: false },
  { id: '2', displayFirstName: 'Jane', displayLastName: 'Smith', isCheckedIn: true },
  { id: '3', displayFirstName: 'Alice', displayLastName: 'Johnson', isCheckedIn: false },
  { id: '4', displayFirstName: 'Bob', displayLastName: 'Brown', isCheckedIn: true },
];

describe('AttendancePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/attendance/members') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMembers)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders loading state initially', () => {
    render(<AttendancePage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('renders members after loading', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('member-1')).toBeInTheDocument();
    expect(screen.getByTestId('member-2')).toBeInTheDocument();
    expect(screen.getByTestId('member-3')).toBeInTheDocument();
    expect(screen.getByTestId('member-4')).toBeInTheDocument();
  });

  test('displays correct total checked in count', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('total-checked-in').textContent).toBe('2');
  });

  test('filters members by search term', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'John' } });
    });
    
    expect(screen.getByTestId('member-1')).toBeInTheDocument();
    expect(screen.queryByTestId('member-2')).not.toBeInTheDocument();
    
    const member3 = screen.queryByTestId('member-3');
    if (member3) {
      expect(member3).toHaveTextContent('Johnson');
    }
    
    expect(screen.queryByTestId('member-4')).not.toBeInTheDocument();
  });

  test('filters members by letter', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    const letterB = screen.getByTestId('letter-B');
    
    await act(async () => {
      fireEvent.click(letterB);
    });
    
    expect(screen.queryByTestId('member-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('member-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('member-3')).not.toBeInTheDocument();
    expect(screen.getByTestId('member-4')).toBeInTheDocument();
  });

  test('clears filters when clear button is clicked', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    const letterD = screen.getByTestId('letter-D');
    
    await act(async () => {
      fireEvent.click(letterD);
    });
    
    expect(screen.getByTestId('member-1')).toBeInTheDocument();
    expect(screen.queryByTestId('member-2')).not.toBeInTheDocument();
    
    const clearButton = screen.getByTestId('clear-filter');
    
    await act(async () => {
      fireEvent.click(clearButton);
    });
    
    expect(screen.getByTestId('member-1')).toBeInTheDocument();
    expect(screen.getByTestId('member-2')).toBeInTheDocument();
    expect(screen.getByTestId('member-3')).toBeInTheDocument();
    expect(screen.getByTestId('member-4')).toBeInTheDocument();
  });

  test('handles check-in toggle', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    const memberElement = screen.getByTestId('member-1');
    expect(memberElement.getAttribute('data-checked')).toBe('false');
    
    await act(async () => {
      fireEvent.click(memberElement);
    });
    
    expect(screen.getByTestId('member-1').getAttribute('data-checked')).toBe('true');
    
    expect(screen.getByTestId('total-checked-in').textContent).toBe('3');
  });

  test('handles API error', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('API Error'));
    });
    
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByTestId('error').textContent).toBe('API Error');
  });

  test('renders all members after loading', async () => {
    render(<AttendancePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('member-1')).toBeInTheDocument();
    expect(screen.getByTestId('member-2')).toBeInTheDocument();
    expect(screen.getByTestId('member-3')).toBeInTheDocument();
    expect(screen.getByTestId('member-4')).toBeInTheDocument();
  });
});

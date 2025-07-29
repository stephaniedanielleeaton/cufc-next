import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlphabetFilter } from './AlphabetFilter';

describe('AlphabetFilter Component', () => {
  const availableLetters = ['A', 'B', 'M', 'S'];
  const mockLetterClick = jest.fn();
  const mockClearFilter = jest.fn();
  
  beforeEach(() => {
    mockLetterClick.mockReset();
    mockClearFilter.mockReset();
  });

  test('renders all alphabet letters', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
      />
    );
    
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  test('disables letters that are not available', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
      />
    );
    
    availableLetters.forEach(letter => {
      expect(screen.getByText(letter)).not.toBeDisabled();
    });
    const unavailableLetters = "CDEFGHIJKLNOPQRTUVWXYZ".split("");
    unavailableLetters.forEach(letter => {
      expect(screen.getByText(letter)).toBeDisabled();
    });
  });

  test('highlights the selected letter', () => {
    const selectedLetter = 'A';
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter={selectedLetter}
        onLetterClick={mockLetterClick}
      />
    );
    
    const selectedButton = screen.getByText(selectedLetter);
    expect(selectedButton).toHaveClass('bg-deep-sea-blue');
    expect(selectedButton).toHaveClass('text-white');
  });

  test('calls onLetterClick when an available letter is clicked', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
      />
    );
    
    fireEvent.click(screen.getByText('A'));
    
    expect(mockLetterClick).toHaveBeenCalledTimes(1);
    expect(mockLetterClick).toHaveBeenCalledWith('A');
  });

  test('does not call onLetterClick when a disabled letter is clicked', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
      />
    );
    
    fireEvent.click(screen.getByText('C'));
    
    expect(mockLetterClick).not.toHaveBeenCalled();
  });

  test('shows clear button when a letter is selected', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter="A"
        onLetterClick={mockLetterClick}
        onClearFilter={mockClearFilter}
      />
    );
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  test('does not show clear button when no letter is selected and onClearFilter is not provided', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
      />
    );
    
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  test('calls onClearFilter when clear button is clicked', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter="A"
        onLetterClick={mockLetterClick}
        onClearFilter={mockClearFilter}
      />
    );
    
    fireEvent.click(screen.getByText('Clear'));
    
    expect(mockClearFilter).toHaveBeenCalledTimes(1);
  });

  test('shows clear button when onClearFilter is provided even if no letter is selected', () => {
    render(
      <AlphabetFilter
        availableLetters={availableLetters}
        selectedLetter=""
        onLetterClick={mockLetterClick}
        onClearFilter={mockClearFilter}
      />
    );
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });
});

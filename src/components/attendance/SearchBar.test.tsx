import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  
  beforeEach(() => {
    mockOnSearch.mockReset();
  });

  test('renders search input with default placeholder', () => {
    render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByPlaceholderText('Enter Name...');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('renders search input with custom placeholder', () => {
    const customPlaceholder = 'Search members...';
    render(<SearchBar searchTerm="" onSearch={mockOnSearch} placeholder={customPlaceholder} />);
    
    const inputElement = screen.getByPlaceholderText(customPlaceholder);
    expect(inputElement).toBeInTheDocument();
  });

  test('displays the provided search term', () => {
    const searchTerm = 'John';
    render(<SearchBar searchTerm={searchTerm} onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByDisplayValue(searchTerm);
    expect(inputElement).toBeInTheDocument();
  });

  test('calls onSearch when input changes', () => {
    render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByPlaceholderText('Enter Name...');
    fireEvent.change(inputElement, { target: { value: 'John' } });
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test('renders search icon', () => {
    const { container } = render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass('text-hover-outer-space');
  });

  test('has correct styling for input field', () => {
    render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByPlaceholderText('Enter Name...');
    expect(inputElement).toHaveClass('border');
    expect(inputElement).toHaveClass('border-deep-sea-blue');
    expect(inputElement).toHaveClass('rounded-lg');
    expect(inputElement).toHaveClass('ps-10');
  });

  test('has accessible search input', () => {
    render(<SearchBar searchTerm="" onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'simple-search');
  });
});

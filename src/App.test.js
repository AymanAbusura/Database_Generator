/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Test if the app renders correctly
test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Global Database Generator/i);
  expect(titleElement).toBeInTheDocument();
});

// Test country selection dropdown
test('renders country select dropdown', () => {
  render(<App />);
  const selectElement = screen.getByLabelText(/Select Country:/i);
  expect(selectElement).toBeInTheDocument();
});

// Test for input field for the number of records
test('renders input for number of records', () => {
  render(<App />);
  const inputElement = screen.getByLabelText(/Number of Records/i);
  expect(inputElement).toBeInTheDocument();
});

// Test error message when invalid input is given
test('shows error message for invalid record count', () => {
  render(<App />);
  const inputElement = screen.getByLabelText(/Number of Records/i);
  fireEvent.change(inputElement, { target: { value: 1001 } });
  fireEvent.blur(inputElement);
  const errorMessage = screen.getByText(/Please enter a number between 1 and 1000/i);
  expect(errorMessage).toBeInTheDocument();
});

// Test data generation button
test('generates data and shows table when "Generate" button is clicked', async () => {
  render(<App />);
  
  const countInput = screen.getByLabelText(/Number of Records/i);
  fireEvent.change(countInput, { target: { value: 5 } });
  
  const generateButton = screen.getByText(/Generate/i);
  fireEvent.click(generateButton);

  await waitFor(() => {
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });
});

// Test "Clear" button functionality
test('clears generated data when "Clear" button is clicked', async () => {
  render(<App />);
  
  const countInput = screen.getByLabelText(/Number of Records/i);
  fireEvent.change(countInput, { target: { value: 5 } });
  
  const generateButton = screen.getByText(/Generate/i);
  fireEvent.click(generateButton);

  await waitFor(() => {
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  const clearButton = screen.getByText(/Clear/i);
  fireEvent.click(clearButton);

  const table = screen.queryByRole('table');
  expect(table).not.toBeInTheDocument();
});

// Test the download JSON button
test('downloads JSON when "Download JSON" button is clicked', async () => {
  render(<App />);
  
  const countInput = screen.getByLabelText(/Number of Records/i);
  fireEvent.change(countInput, { target: { value: 2 } });
  
  const generateButton = screen.getByText(/Generate/i);
  fireEvent.click(generateButton);

  await waitFor(() => {
    const downloadButton = screen.getByText(/Download JSON/i);
    expect(downloadButton).toBeInTheDocument();
    fireEvent.click(downloadButton);
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});

// Mock the Blob API for the download test
beforeAll(() => {
  global.URL.createObjectURL = jest.fn();
});
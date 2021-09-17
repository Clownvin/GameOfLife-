import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const canvases = document.getElementsByTagName('canvas');
  const linkElement = screen.getByText(/pause/i);
  expect(linkElement).toBeInTheDocument();
  expect(canvases.length).toBe(1);
});

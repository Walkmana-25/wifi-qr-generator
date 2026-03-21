import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { GITHUB_REPOSITORY_URL } from '../constants';
import '../i18n';

describe('App', () => {
  it('renders top-right GitHub repository icon link with correct URL', () => {
    render(<App />);

    const link = screen.getByRole('link', { name: /GitHub/ });
    expect(link).toHaveAttribute('href', GITHUB_REPOSITORY_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

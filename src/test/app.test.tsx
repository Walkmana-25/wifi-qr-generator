import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import '../i18n';

describe('App', () => {
  it('renders View Source On GitHub link with correct URL', () => {
    render(<App />);

    const link = screen.getByRole('link', { name: 'View Source On GitHub' });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/Walkmana-25/wifi-qr-generator/issues/new'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

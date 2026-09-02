import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LanguageSelector from '../src/components/LanguageSelector';

const languages = [
  { language: 'English', native_name: 'English', code: 'en' },
  { language: 'Japanese', native_name: '日本語', code: 'ja' },
];

describe('LanguageSelector', () => {
  it('renders every language option', () => {
    render(
      <LanguageSelector languages={languages} selected="en" onSelect={() => {}} />
    );

    expect(screen.getByTestId('language-selector')).toHaveValue('en');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Japanese — 日本語' })).toHaveValue(
      'ja'
    );
  });

  it('reports the selected language code', () => {
    const onSelect = vi.fn();
    render(
      <LanguageSelector languages={languages} selected="en" onSelect={onSelect} />
    );

    fireEvent.change(screen.getByTestId('language-selector'), {
      target: { value: 'ja' },
    });

    expect(onSelect).toHaveBeenCalledWith('ja');
  });
});

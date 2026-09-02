import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GreetingDisplay from '../src/components/GreetingDisplay';

describe('GreetingDisplay', () => {
  it('renders the translated greeting and language labels', () => {
    render(
      <GreetingDisplay
        greeting="こんにちは、世界！"
        language="Japanese"
        nativeName="日本語"
        isLoading={false}
        error={null}
      />
    );

    expect(screen.getByTestId('greeting-display')).toHaveTextContent(
      'こんにちは、世界！'
    );
    expect(screen.getByText('Japanese — 日本語')).toBeInTheDocument();
  });

  it('renders a loading state', () => {
    render(
      <GreetingDisplay
        greeting=""
        language=""
        nativeName=""
        isLoading
        error={null}
      />
    );

    expect(screen.getByText('Translating...')).toBeInTheDocument();
  });

  it('renders an error state', () => {
    render(
      <GreetingDisplay
        greeting=""
        language=""
        nativeName=""
        isLoading={false}
        error="Translation service unavailable"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Translation service unavailable'
    );
  });
});

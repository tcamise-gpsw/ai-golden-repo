import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

const languages = [
  { language: 'English', native_name: 'English', code: 'en' },
  { language: 'Japanese', native_name: '日本語', code: 'ja' },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('selects the browser locale and loads its greeting', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ja-JP');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => languages })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          language: 'Japanese',
          native_name: '日本語',
          code: 'ja',
          greeting: 'こんにちは、世界！',
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findByTestId('language-selector')).toHaveValue('ja');
    expect(await screen.findByText('こんにちは、世界！')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/languages');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/translate/ja');
  });

  it('loads a new greeting when the language changes', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => languages })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          language: 'English',
          native_name: 'English',
          code: 'en',
          greeting: 'Hello, World!',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          language: 'Japanese',
          native_name: '日本語',
          code: 'ja',
          greeting: 'こんにちは、世界！',
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    await screen.findByText('Hello, World!');

    fireEvent.change(screen.getByTestId('language-selector'), {
      target: { value: 'ja' },
    });

    expect(await screen.findByText('こんにちは、世界！')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/translate/ja');
  });

  it('keeps the selector visible when translation fails', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => languages })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ detail: 'Translation service unavailable' }),
        })
    );

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Translation service unavailable'
    );
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });
});

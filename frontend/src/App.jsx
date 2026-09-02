/**
 * @typedef {Object} Language
 * @property {string} language - English name of the language.
 * @property {string} native_name - Language name in its own script.
 * @property {string} code - Translation service language code.
 */

/**
 * @typedef {Language & {greeting: string}} TranslatedGreeting
 */

import { useEffect, useState } from 'react';
import GreetingDisplay from './components/GreetingDisplay';
import LanguageSelector from './components/LanguageSelector';
import { resolveLocale } from './locale';

/**
 * Root application component.
 *
 * Loads available languages, selects the best browser-locale match, and
 * requests a dynamic greeting whenever the selection changes.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  const [languages, setLanguages] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [greeting, setGreeting] = useState(null);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);
  const [languagesError, setLanguagesError] = useState(null);
  const [greetingError, setGreetingError] = useState(null);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const response = await fetch('/api/languages');
        if (!response.ok) {
          throw new Error('Unable to load languages.');
        }

        const availableLanguages = await response.json();
        setLanguages(availableLanguages);
        setSelectedCode(
          resolveLocale(
            navigator.language,
            availableLanguages.map(({ code }) => code)
          )
        );
      } catch (loadError) {
        setLanguagesError(loadError.message);
      } finally {
        setIsLoadingLanguages(false);
      }
    }

    loadLanguages();
  }, []);

  useEffect(() => {
    if (!selectedCode) {
      return;
    }

    async function loadGreeting() {
      setIsLoadingGreeting(true);
      setGreetingError(null);

      try {
        const response = await fetch(`/api/translate/${selectedCode}`);
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.detail ?? 'Unable to load translation.');
        }

        setGreeting(await response.json());
      } catch (loadError) {
        setGreeting(null);
        setGreetingError(loadError.message);
      } finally {
        setIsLoadingGreeting(false);
      }
    }

    loadGreeting();
  }, [selectedCode]);

  if (isLoadingLanguages) {
    return <p>Loading languages...</p>;
  }

  if (languagesError) {
    return <p role="alert">{languagesError}</p>;
  }

  return (
    <main>
      <LanguageSelector
        languages={languages}
        selected={selectedCode}
        onSelect={setSelectedCode}
      />
      <GreetingDisplay
        greeting={greeting?.greeting ?? ''}
        language={greeting?.language ?? ''}
        nativeName={greeting?.native_name ?? ''}
        isLoading={isLoadingGreeting}
        error={greetingError}
      />
    </main>
  );
}

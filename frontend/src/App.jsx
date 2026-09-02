/**
 * @typedef {Object} Greeting
 * @property {string} language    - English name of the language (e.g. "Japanese").
 * @property {string} native_name - Language name in its own script (e.g. "日本語").
 * @property {string} greeting    - Hello World in that language (e.g. "こんにちは").
 */

/**
 * Root application component.
 *
 * Fetches the full greeting list from GET /api/greetings on mount and
 * delegates rendering to {@link GreetingList}. Displays a loading state
 * while the request is in flight and an error message on failure.
 *
 * @returns {JSX.Element}
 */
import { useEffect, useState } from 'react';
import GreetingList from './components/GreetingList';

export default function App() {
  const [greetings, setGreetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGreetings() {
      try {
        const response = await fetch('/api/greetings');

        if (!response.ok) {
          throw new Error('Unable to load greetings.');
        }

        setGreetings(await response.json());
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadGreetings();
  }, []);

  if (isLoading) {
    return <p>Loading greetings...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return <GreetingList greetings={greetings} />;
}

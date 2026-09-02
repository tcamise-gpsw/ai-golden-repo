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

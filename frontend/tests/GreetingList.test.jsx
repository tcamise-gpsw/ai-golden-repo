import { render, screen } from '@testing-library/react';
import GreetingList from '../src/components/GreetingList';

const greetings = [
  { language: 'English', native_name: 'English', greeting: 'Hello, World!' },
  { language: 'Spanish', native_name: 'Español', greeting: '¡Hola, Mundo!' },
];

describe('GreetingList', () => {
  it('renders_all_items', () => {
    render(<GreetingList greetings={greetings} />);

    expect(screen.getAllByTestId('greeting-item')).toHaveLength(greetings.length);
  });

  it('renders_greeting_text', () => {
    render(<GreetingList greetings={greetings} />);

    for (const { greeting } of greetings) {
      expect(screen.getByText(greeting)).toBeInTheDocument();
    }
  });

  it('renders_language_names', () => {
    render(<GreetingList greetings={greetings} />);

    for (const { language } of greetings) {
      expect(screen.getAllByText(language).length).toBeGreaterThan(0);
    }
  });
});

export default function GreetingList({ greetings }) {
  return (
    <ul>
      {greetings.map(({ language, native_name: nativeName, greeting }) => (
        <li key={language} data-testid="greeting-item">
          <strong>{greeting}</strong>
          <small>
            <span>{language}</span> — <span>{nativeName}</span>
          </small>
        </li>
      ))}
    </ul>
  );
}

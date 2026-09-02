/**
 * Renders an unordered list of {@link Greeting} objects.
 *
 * Each item displays the greeting prominently with the English language
 * name and native script name as secondary labels.
 *
 * @param {Object}     props
 * @param {Greeting[]} props.greetings - Greetings to display.
 * @returns {JSX.Element}
 */
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

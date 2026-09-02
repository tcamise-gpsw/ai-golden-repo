/**
 * Render one translated greeting with loading and error states.
 *
 * @param {Object} props
 * @param {string} props.greeting - Translated greeting text.
 * @param {string} props.language - English language name.
 * @param {string} props.nativeName - Language name in its own script.
 * @param {boolean} props.isLoading - Whether a translation is in flight.
 * @param {string|null} props.error - Translation error message, if present.
 * @returns {JSX.Element}
 */
export default function GreetingDisplay({
  greeting,
  language,
  nativeName,
  isLoading,
  error,
}) {
  return (
    <section data-testid="greeting-display" aria-live="polite">
      {isLoading ? (
        <p role="status">Translating...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <h1>{greeting}</h1>
          <p>
            {language} — {nativeName}
          </p>
        </>
      )}
    </section>
  );
}

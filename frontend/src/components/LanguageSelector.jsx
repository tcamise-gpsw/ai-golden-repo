/**
 * Render the controlled language dropdown.
 *
 * @param {Object} props
 * @param {Language[]} props.languages - Languages available for translation.
 * @param {string} props.selected - Selected language code.
 * @param {(code: string) => void} props.onSelect - Selection callback.
 * @returns {JSX.Element}
 */
export default function LanguageSelector({ languages, selected, onSelect }) {
  return (
    <label htmlFor="language-selector">
      Language
      <select
        id="language-selector"
        data-testid="language-selector"
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
      >
        {languages.map(({ language, native_name: nativeName, code }) => (
          <option key={code} value={code}>
            {language} — {nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Resolve a browser locale to the closest available language code.
 *
 * @param {string} browserLocale - Browser locale such as `ja-JP`.
 * @param {string[]} availableCodes - Language codes available from the API.
 * @returns {string} The best available code, falling back to English.
 */
export function resolveLocale(browserLocale, availableCodes) {
  const normalized = browserLocale.replace('_', '-').toLowerCase();
  const exact = availableCodes.find(
    (code) => code.toLowerCase() === normalized
  );

  if (exact) {
    return exact;
  }

  const baseLanguage = normalized.split('-')[0];
  if (baseLanguage === 'zh' && availableCodes.includes('zh-CN')) {
    return 'zh-CN';
  }

  return (
    availableCodes.find(
      (code) => code.toLowerCase().split('-')[0] === baseLanguage
    ) ?? 'en'
  );
}

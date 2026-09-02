import { describe, expect, it } from 'vitest';
import { resolveLocale } from '../src/locale';

const codes = ['en', 'es', 'fr', 'de', 'ja', 'zh-CN', 'ar', 'pt', 'ru', 'ko'];

describe('resolveLocale', () => {
  it.each([
    ['ja', 'ja'],
    ['ja-JP', 'ja'],
    ['en-US', 'en'],
    ['zh', 'zh-CN'],
    ['zh-TW', 'zh-CN'],
    ['zh-HK', 'zh-CN'],
    ['xx-YY', 'en'],
  ])('maps %s to %s', (browserLocale, expected) => {
    expect(resolveLocale(browserLocale, codes)).toBe(expected);
  });
});

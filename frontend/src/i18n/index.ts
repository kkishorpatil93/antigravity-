import { en } from './en';
import { kn } from './kn';
import { SupportedLanguage } from '../types';

export const translations = {
  en,
  kn,
};

export function getTranslation(lang: SupportedLanguage = 'en') {
  return translations[lang] || translations.en;
}


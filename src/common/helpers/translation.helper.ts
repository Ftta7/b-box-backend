export function getTranslation(ar: string, en: string, language: 'ar' | 'en' = 'ar'): string {
    if (language === 'en') {
      return en || ar || '';
    }
    return ar || en || '';
  }
  
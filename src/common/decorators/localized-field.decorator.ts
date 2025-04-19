import { Transform } from 'class-transformer';

export function LocalizedField(): PropertyDecorator {
  return Transform(({ obj }) => {
    const lang = obj?.lang === 'en' ? 'en' : 'ar';
    if (!obj || typeof obj !== 'object') return '';
    return obj.name_translations?.[lang] || '';
  });
}

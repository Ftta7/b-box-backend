import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request & { lang?: 'ar' | 'en' }, res: Response, next: NextFunction) {
    const headerLang = req.headers['accept-language']?.toString().toLowerCase();

    req.lang = headerLang === 'en' ? 'en' : 'ar'; // اللغة الافتراضية = عربي

    next();
  }
}

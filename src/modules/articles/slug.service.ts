import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/db/database.service';
import slugify from 'slugify';

@Injectable()
export class SlugService {
  constructor(private db: DatabaseService) {}

  async generateUniqueSlug(
    title: string,
    existingSlugs: string[] = []
  ): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
    const duplicates = existingSlugs.filter((s) => s.startsWith(baseSlug));

    if (duplicates.length === 0) return baseSlug;

    const usedNumbers = duplicates
      .map((slug) => {
        const match = slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const next = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;
    return `${baseSlug}-${next}`;
  }
}

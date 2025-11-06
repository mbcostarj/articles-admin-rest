import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { sanitize } from 'src/common/utils/sanitizer.util';

export class CreateArticleDto {
  @MaxLength(60)
  @MinLength(10, {
    message: 'Title must be at least 10 characters',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(50, {
    message: 'Content must be at least 50 characters',
  })
  @MaxLength(10000, {
    message: 'The content must be a maximum of 10,000 characters',
  })
  @Transform(({ value }) =>
    sanitize(value, {
      ALLOWED_TAGS: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'h2',
        'ul',
        'li',
        'ol',
      ],
      ALLOWED_ATTR: ['href', 'title'],
    })
  )
  content: string;
}

import {
  IsUUID,
  ValidateNested,
  IsNotEmpty,
  IsObject,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateArticleDto } from './update-article.dto';

export class ArticleUpdateItemDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => UpdateArticleDto)
  @IsObject()
  data: UpdateArticleDto;
}

export class InlineUpdateDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ArticleUpdateItemDto)
  articles: ArticleUpdateItemDto[];
}

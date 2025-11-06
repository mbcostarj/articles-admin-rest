import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListQueryDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit: number;
}

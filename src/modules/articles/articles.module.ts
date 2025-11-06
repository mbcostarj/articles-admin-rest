import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { SlugService } from './slug.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, SlugService],
  exports: [SlugService],
})
export class ArticlesModule {}

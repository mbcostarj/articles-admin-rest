import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListQueryDto } from './dto/list-query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { ArticleUpdateItemDto, InlineUpdateDto } from './dto/inline-update.dto';
import { DeleteByIdsDto } from './dto/inline-delete.dto';

@Controller('articles')
@UseGuards(AuthGuard, PermissionsGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Permissions('admin', 'editor')
  create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    return this.articlesService.create(createArticleDto, req.user.sub);
  }

  @Get()
  @Permissions('admin', 'editor', 'reader')
  findAll(@Query() listQueryDto: ListQueryDto) {
    return this.articlesService.findAll(listQueryDto);
  }

  @Get(':id')
  @Permissions('admin', 'editor', 'reader')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch('inline-edit')
  @Permissions('admin', 'editor')
  async inlineEdit(@Body() inlineUpdateDto: InlineUpdateDto) {
    return this.articlesService.inlineUpdate(inlineUpdateDto);
  }

  @Patch(':id')
  @Permissions('admin', 'editor')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete('inline-delete')
  @Permissions('admin', 'editor')
  removeBatch(@Body() deleteByIdsDto: DeleteByIdsDto) {
    return this.articlesService.deleteManyByIds(deleteByIdsDto);
  }

  @Delete(':id')
  @Permissions('admin', 'editor')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}

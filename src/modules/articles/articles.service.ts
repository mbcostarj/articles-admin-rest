import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DatabaseService } from 'src/common/db/database.service';
import { SlugService } from './slug.service';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { ArticleUpdateItemDto, InlineUpdateDto } from './dto/inline-update.dto';
import { DeleteByIdsDto } from './dto/inline-delete.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  prismaResponseSelect = {
    id: true,
    slug: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  constructor(
    private db: DatabaseService,
    private slugService: SlugService
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: string) {
    const now = new Date();
    const slug = await this.slugService.generateUniqueSlug(
      createArticleDto.title
    );

    return this.db.article.create({
      data: {
        ...createArticleDto,
        slug,
        updatedAt: now,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
  }

  async findAll(dto: { title?: string; page?: number; limit?: number }) {
    const { title, page = 1, limit = 15 } = dto;
    return this.db.article.findMany({
      ...(title && { where: { title: { contains: title } } }),
      skip: (page - 1) * limit,
      take: limit,
      select: this.prismaResponseSelect,
    });
  }

  async findOne(id: string) {
    const article = await this.db.article.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!article) {
      throw new NotFoundError('Article', id);
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.db.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundError('Article', id);

    let slug = article.slug;
    if (updateArticleDto.title && updateArticleDto.title !== article.title) {
      slug = await this.slugService.generateUniqueSlug(updateArticleDto.title);
    }

    return this.db.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        slug,
        updatedAt: new Date(),
      },
      select: this.prismaResponseSelect,
    });
  }

  async inlineUpdate(inlineUpdateDto: InlineUpdateDto) {
    const { articles } = inlineUpdateDto;

    const existingSlugs = await this.db.article.findMany({
      select: { slug: true },
    });
    const slugList = existingSlugs.map((a) => a.slug);

    const processedUpdates = await Promise.all(
      articles.map(async (item) => {
        const { id, data } = item;
        let slug: string | undefined = data.slug;

        if (data.title) {
          const article = await this.db.article.findUnique({
            where: { id },
            select: { title: true, slug: true },
          });

          if (!article) throw new NotFoundError('Article', id);

          if (data.title !== article.title) {
            slug = await this.slugService.generateUniqueSlug(
              data.title,
              slugList
            );

            slugList.push(slug);
          } else {
            slug = article.slug;
          }
        }

        return {
          id,
          data: {
            ...data,
            ...(slug !== undefined && { slug }),
            updatedAt: new Date(),
          },
        };
      })
    );

    const validUpdates = processedUpdates.filter((item) => item !== null);

    const results = await this.db.$transaction(
      validUpdates.map((item) =>
        this.db.article.update({
          where: { id: item.id },
          data: item.data,
        })
      )
    );

    return results;
  }

  async remove(id: string) {
    return await this.db.article.delete({ where: { id } });
  }

  async deleteManyByIds(deleteByIdsDto: DeleteByIdsDto) {
    return this.db.article.deleteMany({
      where: {
        id: { in: deleteByIdsDto.ids },
      },
    });
  }
}

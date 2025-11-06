export class SlugAlreadyExist extends Error {
  constructor(slug: string) {
    super(`Slug ${slug} already exists`);
    this.name = 'SlugAlreadyExist';
  }
}

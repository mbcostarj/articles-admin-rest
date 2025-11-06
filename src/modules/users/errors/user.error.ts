export class EmailAlreadyExistError extends Error {
  constructor(email: string) {
    super(`Email ${email} already exists`);
    this.name = 'EmailAlreadyExist';
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/common/db/database.service';
import { EmailAlreadyExistError } from './errors/user.error';
import { NotFoundError } from 'src/common/errors/not-found.error';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.db.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (user) throw new EmailAlreadyExistError(createUserDto.email);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const permissionsData = createUserDto.permissions
      ? {
          connect: createUserDto.permissions.map((name) => ({ name })),
        }
      : undefined;

    return await this.db.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        permissions: permissionsData, //<- relacionamento
      },
      include: { permissions: true },
    });
  }

  async findAll(dto: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = 15 } = dto;
    return this.db.user.findMany({
      ...(name && { where: { name: { contains: name } } }),
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        permissions: {
          select: {
            id: false,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        permissions: {
          select: {
            id: false,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.db.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundError('User', id);

    const { email, permissions, ...rest } = updateUserDto;

    if (email && email !== user.email) {
      const existingUser = await this.db.user.findUnique({
        where: { email: email },
      });
      if (existingUser) throw new EmailAlreadyExistError(email);
    }

    const permissionsData = permissions
      ? { set: [], connect: permissions.map((name) => ({ name })) }
      : undefined;

    return this.db.user.update({
      where: { id },
      data: { ...rest, email, permissions: permissionsData },
      include: { permissions: true },
    });
  }

  async remove(id: string) {
    return await this.db.user.delete({ where: { id } });
  }
}

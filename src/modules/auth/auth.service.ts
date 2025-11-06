import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/db/database.service';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsError } from './errors/auth.error';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.db.user.findUnique({
      where: { email: loginDto.email },
      include: { permissions: true },
    });

    if (!user) throw new InvalidCredentialsError();

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) throw new InvalidCredentialsError();

    const payload = {
      sub: user.id,
      email: user.email,
      permissions: user.permissions.map((p) => p.name),
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: user.permissions.map((p) => p.name),
      },
    };
  }
}

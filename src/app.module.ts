import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './modules/articles/articles.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './common/db/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { SlugService } from './modules/articles/slug.service';
import { PermissionsModule } from './modules/permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ArticlesModule,
    AuthModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

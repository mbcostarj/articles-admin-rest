import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/db/database.service';

@Injectable()
export class PermissionsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.permission.findMany();
  }
}

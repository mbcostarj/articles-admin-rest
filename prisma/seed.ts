import { PrismaClient } from '../src/generated/prisma/client';
import { UserRole } from '../src/modules/auth/roles/role';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 starting seed...');

  // Criação das permissões
  const permissions = [
    { name: UserRole.Admin, description: 'Full access to all actions' },
    { name: UserRole.Editor, description: 'Can create and edit articles' },
    { name: UserRole.Reader, description: 'Article viewer only' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  const hashedPass = await bcrypt.hash('123@Mudar', 10);
  const rootUser = await prisma.user.upsert({
    where: { email: 'root@admin.com' },
    update: {},
    create: {
      name: 'Root User',
      email: 'root@admin.com',
      password: hashedPass,
      permissions: {
        connect: [{ name: UserRole.Admin }],
      },
    },
  });

  console.log('✅ Default permissions and user root created ');
  console.log({ rootUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

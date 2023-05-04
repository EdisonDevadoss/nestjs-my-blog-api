import * as bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData = [
  {
    id: 1,
    name: 'Edison',
    email: 'edisondevadoss@gmail.com',
    mobile_no: '9043487398',
    role: 'Admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Edison D',
    email: 'edison@yavar.in',
    mobile_no: '8610139246',
    role: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

async function main() {
  const encryptedPassword = bcrypt.hashSync('Test@123', 10);

  for (const user of userData) {
    const createAtts = cloneDeep(user);
    delete createAtts.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: { ...createAtts, hash: encryptedPassword },
      update: { ...user, hash: encryptedPassword },
    });
  }
}
main();

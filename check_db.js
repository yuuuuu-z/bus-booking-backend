import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();

async function check() {
  const booking = await prisma.booking.findUnique({
    where: { id: 21 },
  });
  console.log(JSON.stringify(booking, null, 2));
  await prisma.$disconnect();
}

check();

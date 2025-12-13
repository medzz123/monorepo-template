import { env } from 'node:process';
import { prisma } from './client';

const isLocal = env.DATABASE_URL?.includes('postgresql://postgres:fr24Password@localhost:5433/tab');

async function main() {
  if (!isLocal) {
    throw new Error(
      'Error: env.DATABASE_URL does not match the expected value. Make sure you are using the local DB.'
    );
  }

  // biome-ignore lint/suspicious/noConsole: Its fine
  console.log('***** Seeding Database *****');
}

main().finally(async () => {
  await prisma.$disconnect();
});

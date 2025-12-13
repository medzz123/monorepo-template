import './checkDatabaseUrl';

import { execSync } from 'node:child_process';
import { confirm, input, select } from '@inquirer/prompts';

const main = async () => {
  try {
    const name = await input({
      message: 'What is the name of the migration?',
      validate: (value) => (value.trim() ? true : 'Migration name cannot be empty'),
    });

    const dryRun = await confirm({
      message: 'Do you want to perform a dry run?',
      default: false,
    });

    const database = await select({
      message: 'Select the database to apply the migration to:',
      choices: [
        { name: 'Main', value: 'prisma' },
        { name: 'Financials', value: 'financials-prisma' },
      ],
    });
    console.log('\nMigration Summary:');
    console.log(`  Name: ${name}`);
    console.log(`  Name: ${name}`);
    console.log(`  Database: ${database}`);
    console.log(`  Dry Run: ${dryRun ? 'Yes' : 'No'}`);

    execSync(
      `turbo run @playter/${database}#db:migrate -- --name "${name}" ${dryRun ? '--create-only' : ''}`,
      {
        stdio: 'inherit',
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }
};

main();

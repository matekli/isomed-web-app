import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Loads demo data from prisma/seed.sql into the database.
 * Run with: npx prisma db seed
 * Safe to run repeatedly (uses INSERT OR IGNORE).
 */
async function main() {
  const file = path.join(__dirname, 'seed.sql');
  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  const sql = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); // strip BOM

  // Statements can be on one line or several, so split on ";" followed by INSERT INTO
  const statements: string[] = [];
  for (const part of sql.split(/;\s*(?=INSERT\s+INTO)/i)) {
    const statement = part.trim().replace(/;$/, '');
    if (/^INSERT\s+INTO/i.test(statement)) {
      statements.push(statement.replace(/^INSERT\s+INTO/i, 'INSERT OR IGNORE INTO'));
    }
  }

  if (statements.length === 0) {
    throw new Error('No INSERT statements found in seed.sql');
  }

  await prisma.$transaction(
    async (tx) => {
      // Defer foreign key checks to the end of the transaction,
      // so the order of tables in seed.sql does not matter
      await tx.$executeRawUnsafe('PRAGMA defer_foreign_keys = ON');
      for (const statement of statements) {
        await tx.$executeRawUnsafe(statement);
      }
    },
    { timeout: 300000, maxWait: 30000 },
  );

  console.log(`Seed finished: ${statements.length} records inserted.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

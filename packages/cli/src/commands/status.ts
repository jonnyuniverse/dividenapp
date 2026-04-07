import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { getCorePackagePath } from '../utils/scaffold';

export async function statusCommand(): Promise<void> {
  logger.brand();
  logger.info('System Status');
  logger.blank();

  const cwd = process.cwd();

  // Check .env
  const envExists = await fs.pathExists(path.join(cwd, '.env'));
  const configExists = await fs.pathExists(path.join(cwd, 'dividen.config.ts'));
  const prismaExists = await fs.pathExists(path.join(cwd, 'prisma', 'schema.prisma'));

  let coreFound = false;
  let coreVersion = 'unknown';
  try {
    const corePath = getCorePackagePath();
    coreFound = true;
    const corePkg = await fs.readJSON(path.join(corePath, 'package.json'));
    coreVersion = corePkg.version || 'unknown';
  } catch {
    // Core not found
  }

  // Check database URL
  let dbConfigured = false;
  if (envExists) {
    try {
      const envContent = await fs.readFile(path.join(cwd, '.env'), 'utf-8');
      const dbUrl = envContent.match(/DATABASE_URL=(.+)/);
      if (dbUrl && dbUrl[1] && !dbUrl[1].includes('your_')) {
        dbConfigured = true;
      }
    } catch {
      // Ignore
    }
  }

  const status = (ok: boolean): string =>
    ok ? chalk.green('✔ Ready') : chalk.yellow('✖ Not configured');

  logger.table({
    'Environment (.env)': status(envExists),
    'Configuration': status(configExists),
    'Prisma Schema': status(prismaExists),
    'Core Package': coreFound ? chalk.green(`✔ v${coreVersion}`) : chalk.yellow('✖ Not found'),
    'Database URL': status(dbConfigured),
  });

  logger.blank();

  if (!envExists || !configExists) {
    logger.info('Run "dividen init" to set up your project.');
  } else if (!dbConfigured) {
    logger.info('Edit your .env file to configure the database URL.');
  } else {
    logger.success('All systems ready. Run "dividen dev" to start.');
  }

  logger.blank();
}

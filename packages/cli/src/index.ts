#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { startCommand } from './commands/start';
import { devCommand } from './commands/dev';
import { statusCommand } from './commands/status';
import { logger } from './utils/logger';

const program = new Command();

program
  .name('dividen')
  .description('DiviDen Command Center — Coordination between humans and AI agents')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new DiviDen project')
  .argument('[directory]', 'Target directory', '.')
  .option('--skip-install', 'Skip npm install')
  .option('--skip-prisma', 'Skip Prisma setup')
  .action(async (directory: string, options: { skipInstall?: boolean; skipPrisma?: boolean }) => {
    try {
      await initCommand(directory, options);
    } catch (error: any) {
      logger.error(error.message || 'Init failed');
      process.exit(1);
    }
  });

program
  .command('start')
  .description('Start the DiviDen Command Center in production mode')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .action(async (options: { port: string }) => {
    try {
      await startCommand(options);
    } catch (error: any) {
      logger.error(error.message || 'Start failed');
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start the DiviDen Command Center in development mode')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .action(async (options: { port: string }) => {
    try {
      await devCommand(options);
    } catch (error: any) {
      logger.error(error.message || 'Dev failed');
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show DiviDen system status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error: any) {
      logger.error(error.message || 'Status check failed');
      process.exit(1);
    }
  });

program.parse();

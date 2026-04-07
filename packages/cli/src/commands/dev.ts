import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from '../utils/logger';
import { getCorePackagePath } from '../utils/scaffold';

export interface DevOptions {
  port: string;
}

export async function devCommand(options: DevOptions): Promise<void> {
  logger.brand();
  logger.info('Starting DiviDen Command Center (development)...');
  logger.blank();

  // Load .env from current directory if it exists
  const envPath = path.resolve(process.cwd(), '.env');
  if (await fs.pathExists(envPath)) {
    logger.info('Loading environment from .env');
  } else {
    logger.warn('No .env file found. Run "dividen init" first.');
  }

  let corePath: string;
  try {
    corePath = getCorePackagePath();
  } catch {
    logger.error('Could not find @dividen/core package.');
    logger.info('Run "dividen init" first to set up your project.');
    return;
  }

  logger.info(`Core package: ${corePath}`);
  logger.info(`Starting dev server on port ${options.port}...`);
  logger.info(`Dashboard: http://localhost:${options.port}`);
  logger.blank();

  const child = spawn('npx', ['next', 'dev', '-p', options.port], {
    cwd: corePath,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: options.port,
      DOTENV_CONFIG_PATH: envPath,
    },
    shell: true,
  });

  child.on('error', (err) => {
    logger.error(`Failed to start dev server: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

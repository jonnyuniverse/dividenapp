import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from '../utils/logger';
import { getCorePackagePath } from '../utils/scaffold';

export interface StartOptions {
  port: string;
}

export async function startCommand(options: StartOptions): Promise<void> {
  logger.brand();
  logger.info('Starting DiviDen Command Center (production)...');
  logger.blank();

  // Load .env from current directory if it exists
  const envPath = path.resolve(process.cwd(), '.env');
  if (await fs.pathExists(envPath)) {
    logger.info('Loading environment from .env');
  }

  let corePath: string;
  try {
    corePath = getCorePackagePath();
  } catch {
    logger.error('Could not find @dividen/core package.');
    logger.info('Run "dividen init" first to set up your project.');
    return;
  }

  logger.info(`Starting on port ${options.port}...`);
  logger.blank();

  const child = spawn('npx', ['next', 'start', '-p', options.port], {
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
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

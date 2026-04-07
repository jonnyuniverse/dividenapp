import { logger } from '../utils/logger';
import { scaffoldProject, ScaffoldOptions } from '../utils/scaffold';

export async function initCommand(
  directory: string,
  options: ScaffoldOptions
): Promise<void> {
  logger.brand();
  logger.info(`Initializing DiviDen project in: ${directory === '.' ? 'current directory' : directory}`);
  logger.blank();

  await scaffoldProject(directory, options);
}

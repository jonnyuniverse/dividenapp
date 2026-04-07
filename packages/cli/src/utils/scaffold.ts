import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from './logger';

/**
 * Resolves the path to the templates directory.
 * When running from the monorepo, templates are at the repo root.
 * When installed as a package, templates are bundled alongside the CLI.
 */
function getTemplatesDir(): string {
  // Try monorepo layout first (../../templates from packages/cli)
  const monorepoTemplates = path.resolve(__dirname, '..', '..', '..', '..', 'templates');
  if (fs.existsSync(monorepoTemplates)) {
    return monorepoTemplates;
  }

  // Fallback: templates next to cli package
  const localTemplates = path.resolve(__dirname, '..', '..', 'templates');
  if (fs.existsSync(localTemplates)) {
    return localTemplates;
  }

  throw new Error(
    'Could not find templates directory. Please ensure DiviDen is installed correctly.'
  );
}

/**
 * Resolves the path to the core package.
 */
export function getCorePackagePath(): string {
  // Try monorepo layout
  const monorepoCoreDir = path.resolve(__dirname, '..', '..', '..', 'core');
  if (fs.existsSync(monorepoCoreDir)) {
    return monorepoCoreDir;
  }

  // Try node_modules
  try {
    return path.dirname(require.resolve('@dividen/core/package.json'));
  } catch {
    throw new Error(
      'Could not find @dividen/core package. Please ensure DiviDen is installed correctly.'
    );
  }
}

export interface ScaffoldOptions {
  skipInstall?: boolean;
  skipPrisma?: boolean;
}

export async function scaffoldProject(
  targetDir: string,
  options: ScaffoldOptions = {}
): Promise<void> {
  const resolvedDir = path.resolve(process.cwd(), targetDir);
  const templatesDir = getTemplatesDir();

  logger.step(1, 5, 'Creating project directory...');
  await fs.ensureDir(resolvedDir);

  // Copy template files
  logger.step(2, 5, 'Copying template files...');
  const templateFiles = ['dividen.config.ts', '.env.example', 'README.md'];

  for (const file of templateFiles) {
    const src = path.join(templatesDir, file);
    const dest = path.join(resolvedDir, file);

    if (await fs.pathExists(src)) {
      await fs.copy(src, dest, { overwrite: false });
      logger.success(`Created ${file}`);
    } else {
      logger.warn(`Template not found: ${file}`);
    }
  }

  // Create .env from .env.example
  logger.step(3, 5, 'Setting up environment...');
  const envExamplePath = path.join(resolvedDir, '.env.example');
  const envPath = path.join(resolvedDir, '.env');

  if ((await fs.pathExists(envExamplePath)) && !(await fs.pathExists(envPath))) {
    await fs.copy(envExamplePath, envPath);
    logger.success('Created .env from template');
  } else if (await fs.pathExists(envPath)) {
    logger.info('.env already exists, skipping');
  }

  // Create project package.json if it doesn't exist
  const projectPkgPath = path.join(resolvedDir, 'package.json');
  if (!(await fs.pathExists(projectPkgPath))) {
    const projectPkg = {
      name: path.basename(resolvedDir),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'dividen dev',
        start: 'dividen start',
        status: 'dividen status',
      },
      dependencies: {
        '@dividen/cli': '^0.1.0',
        '@dividen/core': '^0.1.0',
      },
    };
    await fs.writeJSON(projectPkgPath, projectPkg, { spaces: 2 });
    logger.success('Created package.json');
  }

  // Create prisma directory with symlink or copy
  logger.step(4, 5, 'Setting up database schema...');
  const prismaDir = path.join(resolvedDir, 'prisma');
  await fs.ensureDir(prismaDir);

  try {
    const corePath = getCorePackagePath();
    const coreSchemaPath = path.join(corePath, 'prisma', 'schema.prisma');

    if (await fs.pathExists(coreSchemaPath)) {
      const destSchema = path.join(prismaDir, 'schema.prisma');
      await fs.copy(coreSchemaPath, destSchema, { overwrite: true });
      logger.success('Copied Prisma schema');
    } else {
      logger.warn('Prisma schema not found in core package');
    }
  } catch (err: any) {
    logger.warn(`Could not set up Prisma schema: ${err.message}`);
  }

  logger.step(5, 5, 'Finalizing project...');

  // Create .gitignore
  const gitignorePath = path.join(resolvedDir, '.gitignore');
  if (!(await fs.pathExists(gitignorePath))) {
    await fs.writeFile(
      gitignorePath,
      'node_modules/\n.next/\n.env\n.env.local\ndist/\n*.db\n.turbo/\n'
    );
    logger.success('Created .gitignore');
  }

  logger.blank();
  logger.success('Project scaffolded successfully!');
  logger.blank();
  logger.info('Next steps:');
  logger.list([
    `cd ${targetDir === '.' ? '(current directory)' : targetDir}`,
    'Edit .env with your database URL and secrets',
    'Run: dividen dev',
  ]);
}

import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';
import { logger } from './logger';

/**
 * Resolves the path to the core Next.js application.
 * Works both in monorepo dev and when installed as an npm package.
 */
export function getCorePackagePath(): string {
  // Try monorepo layout (../../core from packages/cli/dist)
  const monorepoCoreDir = path.resolve(__dirname, '..', '..', '..', 'core');
  if (fs.existsSync(path.join(monorepoCoreDir, 'package.json'))) {
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
  const projectName = path.basename(resolvedDir);

  // ── Step 1: Create project directory ──────────────────────────────
  logger.step(1, 6, 'Creating project directory...');
  await fs.ensureDir(resolvedDir);

  // ── Step 2: Copy the full Next.js app from core ──────────────────
  logger.step(2, 6, 'Copying DiviDen application...');

  let corePath: string;
  try {
    corePath = getCorePackagePath();
  } catch {
    logger.error('Could not find @dividen/core. Falling back to GitHub clone...');
    try {
      execSync(
        `git clone --depth 1 https://github.com/jonnyuniverse/dividenapp.git "${resolvedDir}/.dividen-tmp"`,
        { stdio: 'pipe' }
      );
      corePath = path.join(resolvedDir, '.dividen-tmp', 'packages', 'core');
    } catch (cloneErr: any) {
      logger.error('Failed to clone from GitHub. Check your network connection.');
      throw cloneErr;
    }
  }

  // Copy core app files (excluding node_modules, .next, .env, build artifacts)
  const SKIP = new Set([
    'node_modules', '.next', '.build', '.env', '.env.local',
    'dist', 'build', 'out', '.turbo', '.git', 'dev.db',
    'tsconfig.tsbuildinfo', 'next-env.d.ts',
    '.yarn', '.yarnrc.yml', 'yarn.lock', 'package-lock.json',
  ]);

  async function copyFiltered(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest, {
      filter: (srcPath: string) => {
        const basename = path.basename(srcPath);
        return !SKIP.has(basename);
      },
      overwrite: false,
    });
  }

  await copyFiltered(corePath, resolvedDir);
  logger.success('Application files copied');

  // Clean up temp clone if used
  const tmpDir = path.join(resolvedDir, '.dividen-tmp');
  if (await fs.pathExists(tmpDir)) {
    await fs.remove(tmpDir);
  }

  // ── Step 3: Create .env from template ────────────────────────────
  logger.step(3, 6, 'Setting up environment...');
  const envPath = path.join(resolvedDir, '.env');
  if (!(await fs.pathExists(envPath))) {
    const envContent = [
      '# DiviDen Command Center — Environment Configuration',
      '# See docs: https://github.com/jonnyuniverse/dividenapp',
      '',
      '# ── Database (required) ──────────────────────────────────────',
      '# PostgreSQL connection string',
      'DATABASE_URL="postgresql://user:password@localhost:5432/dividen?schema=public"',
      '',
      '# ── Authentication (required) ────────────────────────────────',
      '# Generate with: openssl rand -base64 32',
      `NEXTAUTH_SECRET="${generateSecret()}"`,
      'NEXTAUTH_URL="http://localhost:3000"',
      '',
      '# ── AI Provider (at least one required) ──────────────────────',
      '# Add your preferred AI provider key',
      '# OPENAI_API_KEY="sk-..."',
      '# ANTHROPIC_API_KEY="sk-ant-..."',
      '',
      '# ── Optional ────────────────────────────────────────────────',
      '# PORT=3000',
      '',
    ].join('\n');
    await fs.writeFile(envPath, envContent);
    logger.success('Created .env with generated NEXTAUTH_SECRET');
  } else {
    logger.info('.env already exists, skipping');
  }

  // ── Step 4: Create project package.json (merge with core) ──────
  logger.step(4, 6, 'Configuring package.json...');
  const pkgPath = path.join(resolvedDir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJSON(pkgPath);
    // Update name and add convenience scripts
    pkg.name = projectName;
    pkg.version = pkg.version || '0.1.0';
    pkg.private = true;
    pkg.scripts = {
      ...pkg.scripts,
      dev: 'next dev',
      build: 'npx prisma generate && next build',
      start: 'next start',
      'db:push': 'npx prisma db push',
      'db:migrate': 'npx prisma migrate dev',
      'db:generate': 'npx prisma generate',
      'db:studio': 'npx prisma studio',
      'db:seed': 'npx tsx scripts/seed.ts',
    };
    await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
    logger.success('Updated package.json');
  }

  // ── Step 5: Install dependencies ─────────────────────────────────
  if (!options.skipInstall) {
    logger.step(5, 6, 'Installing dependencies...');
    try {
      execSync('npm install', { cwd: resolvedDir, stdio: 'inherit' });
      logger.success('Dependencies installed');
    } catch {
      logger.warn('npm install failed. You can run it manually later.');
    }
  } else {
    logger.step(5, 6, 'Skipping dependency installation (--skip-install)');
  }

  // ── Step 6: Set up Prisma ────────────────────────────────────────
  if (!options.skipPrisma) {
    logger.step(6, 6, 'Setting up database...');
    const schemaPath = path.join(resolvedDir, 'prisma', 'schema.prisma');
    if (await fs.pathExists(schemaPath)) {
      logger.info('Prisma schema found. Run "npx prisma db push" after configuring DATABASE_URL.');
    } else {
      logger.warn('Prisma schema not found.');
    }
  } else {
    logger.step(6, 6, 'Skipping Prisma setup (--skip-prisma)');
  }

  // ── Create .gitignore ────────────────────────────────────────────
  const gitignorePath = path.join(resolvedDir, '.gitignore');
  if (!(await fs.pathExists(gitignorePath))) {
    await fs.writeFile(
      gitignorePath,
      [
        'node_modules/',
        '.next/',
        '.build/',
        '.env',
        '.env.local',
        'dist/',
        '*.db',
        '.turbo/',
      ].join('\n') + '\n'
    );
    logger.success('Created .gitignore');
  }

  // ── Done ──────────────────────────────────────────────────────────
  logger.blank();
  logger.success('DiviDen Command Center is ready!');
  logger.blank();
  logger.info('Next steps:');
  logger.list([
    `cd ${targetDir === '.' ? '(stay here)' : targetDir}`,
    'Edit .env — set DATABASE_URL to your PostgreSQL connection string',
    'Run: npx prisma db push   (creates database tables)',
    'Run: npm run dev           (starts the dashboard at http://localhost:3000)',
    'Visit /setup to create your admin account',
  ]);
  logger.blank();
  logger.info('Docs: https://github.com/jonnyuniverse/dividenapp');
  logger.blank();
}

/** Generate a random base64 secret for NEXTAUTH_SECRET */
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

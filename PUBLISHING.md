# DiviDen Publishing Guide

Step-by-step instructions for publishing DiviDen to npm and deploying the core application.

## 📦 Publishing CLI to npm

### Prerequisites

1. An [npm account](https://www.npmjs.com/signup)
2. Node.js 18+ installed
3. All packages build successfully

### Steps

```bash
# 1. Build all packages
npm run build

# 2. Verify the CLI package contents
cd packages/cli
npm pack --dry-run
# Review the file list — should only include dist/ and package.json

# 3. Login to npm
npm login

# 4. Publish the CLI package
cd packages/cli
npm publish
# For scoped packages: npm publish --access public

# 5. Verify it works
npx dividen --version
```

### Version Bumping

```bash
# Patch release (bug fixes)
cd packages/cli && npm version patch

# Minor release (new features)
cd packages/cli && npm version minor

# Major release (breaking changes)
cd packages/cli && npm version major
```

After bumping, rebuild, commit, tag, and publish:

```bash
npm run build
git add -A
git commit -m "release: v$(node -p "require('./packages/cli/package.json').version")"
git tag "v$(node -p "require('./packages/cli/package.json').version")"
git push && git push --tags
cd packages/cli && npm publish
```

## 🚀 Deploying the Core App

### Option 1: Vercel

1. Push code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `packages/core`
4. Set **Build Command**: `npx prisma generate && next build`
5. Set **Output Directory**: `.next`
6. Add environment variables (see below)
7. Deploy

### Option 2: Railway

1. Create a new project on [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add a PostgreSQL database service
4. Set the **Root Directory** to `packages/core`
5. Add environment variables
6. Railway auto-detects Next.js and deploys

### Option 3: Docker (Self-hosted)

```dockerfile
# Example Dockerfile for packages/core
FROM node:18-alpine AS base
WORKDIR /app

COPY packages/core/package.json ./
RUN npm install

COPY packages/core/ ./
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dividen` |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app's public URL | `https://your-app.vercel.app` |

### AI Providers (at least one required)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |

### Optional

| Variable | Description | Default |
|----------|-------------|----------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## 🗄️ Database Setup

### Local Development

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb dividen

# Set DATABASE_URL in .env
# DATABASE_URL="postgresql://localhost:5432/dividen"

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to browse data
npx prisma studio
```

### Production

Use a managed PostgreSQL service:
- **Supabase** (free tier available)
- **Railway** (built-in PostgreSQL)
- **Neon** (serverless PostgreSQL)
- **AWS RDS** / **Google Cloud SQL**

Run migrations in production:

```bash
npx prisma migrate deploy
```

## ✅ Pre-publish Checklist

- [ ] All TypeScript compiles: `npm run build`
- [ ] Type checking passes: `npm run typecheck`
- [ ] No `.env` files in repo: `git status`
- [ ] `.gitignore` excludes sensitive files
- [ ] `package.json` metadata is correct (name, version, description, repository)
- [ ] `README.md` files are up to date
- [ ] License file exists
- [ ] `npm pack --dry-run` shows expected files
- [ ] CLI works locally: `npm link && dividen --help`

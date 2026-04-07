# DiviDen Command Center

Your personal coordination hub between humans and AI agents.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI and/or Anthropic API key

### Setup

1. **Configure your environment:**

   Edit the `.env` file with your database URL and secrets:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dividen"
   NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Set up the database:**

   ```bash
   npx prisma db push
   ```

3. **Start the development server:**

   ```bash
   dividen dev
   ```

4. **Open the Command Center:**

   Visit [http://localhost:3000](http://localhost:3000) and create your admin account.

## Commands

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `dividen init`   | Initialize a new DiviDen project       |
| `dividen dev`    | Start in development mode (hot reload) |
| `dividen start`  | Start in production mode               |
| `dividen status` | Show system status                     |

## Configuration

Edit `dividen.config.ts` to customize:

- **Operating Mode**: Cockpit (you drive) vs Chief of Staff (AI drives)
- **AI Provider**: OpenAI GPT-4 or Anthropic Claude
- **Dashboard Layout**: Toggle panels and default views

## Dashboard Layout

The three-panel design:

- **NOW Panel** (left): Current focus, quick actions, today's progress
- **Center Panel** (main): Chat, Kanban board, CRM — tabbed interface
- **Queue Panel** (right): Incoming tasks, agent suggestions, notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (credentials)
- **UI**: Tailwind CSS
- **AI**: OpenAI GPT-4 & Anthropic Claude

## License

MIT

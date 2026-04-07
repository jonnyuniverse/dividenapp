# dividen

**The AI-Human Coordination Command Center CLI**

Scaffold and manage DiviDen Command Center projects — the cockpit where humans and AI agents collaborate.

## 🚀 Quick Start

```bash
# Create a new project
npx dividen init my-command-center
cd my-command-center

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Set up database
npx prisma db push

# Start development
npx dividen dev
```

Open [http://localhost:3000](http://localhost:3000) to access your Command Center.

## 🛠️ Commands

### `dividen init [directory]`

Scaffold a new DiviDen project with all configuration files, database schema, and dependencies.

**Options:**
- `--skip-install` — Skip automatic `npm install`
- `--skip-prisma` — Skip Prisma client generation

```bash
npx dividen init my-project
npx dividen init my-project --skip-install
```

### `dividen dev`

Start the Command Center in development mode with hot reload.

```bash
npx dividen dev
npx dividen dev --port 4000
```

### `dividen start`

Start the Command Center in production mode.

```bash
npx dividen start
npx dividen start --port 8080
```

### `dividen status`

Check project configuration and system health.

```bash
npx dividen status
```

## ✨ What You Get

A DiviDen Command Center includes:

- **AI Chat** — Streaming conversations with GPT-4o / Claude with action tag execution
- **Kanban Board** — Drag-and-drop pipeline with customizable stages
- **Smart Queue** — Priority-based task dispatch
- **CRM** — Contact management auto-linked to Kanban cards
- **3-Tier Memory** — Facts, rules, and learned patterns
- **Webhook Support** — Receive events from external services
- **Agent API** — Let external AI agents interact with your center

## 📝 Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **OpenAI** or **Anthropic** API key

## 📦 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dividen"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# At least one AI provider
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

## 📚 Full Documentation

Visit the [DiviDen GitHub repository](https://github.com/jonnyuniverse/dividen) for:
- Architecture overview
- Integration guides
- Contributing guidelines
- Deployment instructions

## 📄 License

MIT © [DiviDen Contributors](https://github.com/jonnyuniverse/dividen)

---

**[dividen.ai](https://dividen.ai)**

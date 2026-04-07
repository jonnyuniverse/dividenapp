# DiviDen 🏛️

**The AI-Human Coordination Command Center**

DiviDen is an open-source framework for building intelligent command centers where humans and AI agents collaborate seamlessly. Think of it as the cockpit where you coordinate AI agents, manage tasks, track contacts, and maintain full situational awareness.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/dividen.svg)](https://www.npmjs.com/package/dividen)

## 🚀 Quick Start

```bash
# Create a new DiviDen project
npx dividen init my-command-center
cd my-command-center

# Configure your environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Set up the database
npx prisma db push

# Start the development server
npx dividen dev
```

Open [http://localhost:3000](http://localhost:3000) to access your Command Center.

## ✨ Features

- **🤖 AI Chat Engine** — Stream conversations with GPT-4o or Claude, with automatic action tag execution
- **📊 Kanban Board** — Drag-and-drop pipeline management with customizable stages
- **📋 Smart Queue** — Priority-based task dispatch with ready/in-progress/done/blocked states
- **👥 CRM** — Contact management with auto-linking to Kanban cards
- **🧠 3-Tier Memory System** — Explicit facts, behavioral rules, and learned patterns
- **🔗 Webhook Infrastructure** — Receive and process webhooks from external services
- **🔑 Agent API** — External API for AI agents to interact with your command center
- **🎯 Dual Mode** — Switch between "Cockpit" (hands-on) and "Chief of Staff" (delegation) modes
- **🛡️ Secure by Default** — NextAuth.js authentication, role-based access

## 🏗️ Architecture

DiviDen is a TypeScript monorepo with two main packages:

```
dividen/
├── packages/
│   ├── cli/          # CLI tool (published to npm as "dividen")
│   └── core/         # Next.js Command Center application
├── templates/        # Project scaffolding templates
├── docs/             # Documentation
└── turbo.json        # Turborepo build orchestration
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes, Server-Sent Events |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js with credentials provider |
| AI | OpenAI GPT-4o, Anthropic Claude |
| Build | Turborepo, TypeScript 5 |
| CLI | Commander.js, Chalk |

## 📦 Installation

### Via npx (Recommended)

```bash
npx dividen init my-project
```

### Global Install

```bash
npm install -g dividen
dividen init my-project
```

### From Source

```bash
git clone https://github.com/jonnyuniverse/dividen.git
cd dividen
npm install
npm run build
```

## 📚 Documentation

- [Integration Guide](./docs/integrations.md) — Webhooks, APIs, and third-party integrations
- [Publishing Guide](./PUBLISHING.md) — How to publish and deploy
- [Template README](./templates/README.md) — End-user project documentation

## 🛠️ CLI Commands

| Command | Description |
|---------|-------------|
| `dividen init [dir]` | Scaffold a new DiviDen project |
| `dividen dev` | Start development server |
| `dividen start` | Start production server |
| `dividen status` | Check project health and configuration |

## 🤝 Contributing

Contributions are welcome! Here’s how to get started:

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/dividen.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes and add tests
6. Build and verify: `npm run build && npm run typecheck`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to your branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start all packages in dev mode
npm run dev

# Build everything
npm run build

# Type-check
npm run typecheck
```

## 📄 License

MIT © [DiviDen Contributors](https://github.com/jonnyuniverse/dividen)

---

**[dividen.ai](https://dividen.ai)** — Coordinate humans and AI agents, together.

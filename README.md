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

### Core Dashboard
- **🤖 Divi AI Agent** — Conversational AI powered by GPT-4o or Claude with 16-layer contextual system prompt and automatic action execution
- **📊 Kanban Board** — 10-stage drag-and-drop pipeline (leads → qualifying → proposal → negotiation → contracted → active → development → planning → paused → completed)
- **📋 Smart Queue** — Priority-based task dispatch with ready/in-progress/done/blocked states + activity feed
- **👥 CRM** — Contact management with auto-linking to Kanban cards and enrichment
- **🧠 3-Tier Memory System** — Explicit facts, behavioral rules, and learned patterns
- **🎯 Dual Mode** — Switch between "Cockpit" (hands-on) and "Chief of Staff" (delegation) modes

### Communication & Calendar
- **📡 Comms Channel** — Bidirectional task-passing between operator and Divi with state lifecycle tracking (new → read → acknowledged → resolved → dismissed)
- **📅 Calendar** — Agenda view with day-grouped events, NowPanel "Coming Up" section, and webhook-driven event creation
- **📧 Inbox** — Email triage with unread/starred filters, detail pane, and webhook-driven email ingestion

### Content & Recordings
- **🎙️ Recordings** — Meeting transcript management supporting Plaud, Otter, Fireflies, or any note-taker via webhooks
- **📁 Drive** — Document management (notes, reports, templates, meeting notes) with Markdown editor and external file URL support (Google Drive, Dropbox, OneDrive)

### Integration & Setup
- **🔗 Webhook Infrastructure** — 4 webhook types (calendar, email, transcript, generic) with auto-learn field mapping
- **🧠 Auto-Learn Field Mapping** — LLM-powered analysis of incoming webhook payloads to automatically map fields, with manual override UI
- **🛠️ Platform Setup Assistant** — Ask Divi to set up webhooks, save API keys, create events, documents, and more — directly from chat
- **🔑 Agent API v2** — External API for AI agents to interact with your command center
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

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header: [Divi Logo] [Mode Toggle] [Comms 📡] [⚙️]      │
├──────────┬──────────────────────────────┬────────────────┤
│  NOW     │  CENTER                      │  QUEUE         │
│          │  [Chat|Board|CRM|Calendar|   │  [Divi's Queue]│
│ Pulse    │   Inbox|Recordings|Drive]    │  [Activity]    │
│ Coming Up│                              │                │
│ Portfolio│                              │                │
└──────────┴──────────────────────────────┴────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes, Server-Sent Events |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js with credentials provider |
| AI | OpenAI GPT-4o, Anthropic Claude (BYOK) |
| Build | Turborepo, TypeScript 5 |
| CLI | Commander.js, Chalk |

## 🤖 Divi — The AI Agent

Divi is the AI agent at the heart of DiviDen. It operates with a **16-layer system prompt** that gives it full contextual awareness:

| Layer | Context |
|-------|--------|
| 1 | Identity & operating mode |
| 2 | Custom rules |
| 3 | Conversation summary |
| 4 | Kanban board state |
| 5 | Queue state |
| 6 | CRM contacts |
| 7 | 3-tier memory |
| 8 | Recent messages |
| 9 | Current time |
| 10 | User learnings |
| 11 | Active focus (NOW panel) |
| 12 | Calendar events (next 7 days) |
| 13 | Email inbox (unread) |
| 14 | System capabilities |
| 15 | Action tag syntax |
| 16 | Platform setup assistant |

### Action Tags

Divi can execute actions by embedding tags in its responses. Tags are automatically stripped before display — users only see natural language.

```
[[create_card:{"title":"Follow up with Acme","status":"leads","priority":"high"}]]
[[setup_webhook:{"name":"Google Calendar","type":"calendar"}]]
[[create_calendar_event:{"title":"Team standup","startTime":"2025-01-15T09:00:00Z"}]]
[[create_document:{"title":"Meeting Notes","content":"## Discussion...","type":"meeting_notes"}]]
[[send_comms:{"content":"Task complete — Acme proposal sent","priority":"normal"}]]
[[save_api_key:{"provider":"openai","apiKey":"sk-..."}]]
```

### Platform Setup via Chat

Once you add an API key, Divi becomes your setup assistant:

> **You:** "Help me connect Google Calendar"
>
> **Divi:** "I'll create a calendar webhook for you right now. Here's what I did: [creates webhook]. Now, to complete the connection, set up a Zapier zap with these steps..."

Divi knows what's configured and what's missing. It can create webhooks, save API keys, add calendar events, create documents, send comms messages, and guide you through external integrations step by step.

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
git clone https://github.com/jonnyuniverse/dividenapp.git
cd dividen
npm install
npm run build
```

## 📚 Documentation

- [Integration Guide](./docs/integrations.md) — Webhooks, auto-learn, APIs, and third-party integrations
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

Contributions are welcome! Here's how to get started:

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

MIT © [DiviDen Contributors](https://github.com/jonnyuniverse/dividenapp)

---

**[dividen.ai](https://dividen.ai)** — Coordinate humans and AI agents, together.

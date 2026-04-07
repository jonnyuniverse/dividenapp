# DiviDen Integration Guide

## Overview

DiviDen uses a **webhook-first** integration approach. Instead of complex OAuth flows, you connect external services by creating webhook endpoints that receive data from automation platforms like Zapier, Make (Integromat), n8n, or direct API calls.

**New in Phase 2:** Divi can now set up webhooks for you directly from chat. Just say "Help me connect Google Calendar" and Divi will create the webhook and walk you through the rest.

---

## Webhooks

### How It Works

1. **Create a webhook** in Settings → Integrations (or ask Divi to do it in chat)
2. **Choose a type**: Calendar, Email, Transcript, or Generic
3. **Copy the URL and secret** provided
4. **Configure your automation tool** (Zapier, Make, etc.) to POST data to the webhook URL
5. **DiviDen auto-learns** the payload structure and maps fields automatically
6. **Fine-tune** the field mapping in Settings → Webhooks → Field Mapping if needed

### Webhook Types

| Type | Endpoint | Auto-Actions |
|------|----------|-------------|
| Calendar | `/api/webhooks/calendar` | Creates CalendarEvent + queue item, adds attendees as contacts |
| Email | `/api/webhooks/email` | Creates EmailMessage + queue notification, adds sender as contact |
| Transcript | `/api/webhooks/transcript` | Creates Recording + kanban card with checklist from action items, adds participant contacts |
| Generic | `/api/webhooks/generic` | Creates a queue item with the payload data |

### Authentication

Every webhook has a unique **secret key** (format: `whsec_...`). You can authenticate requests using any of these methods:

#### 1. Query Parameter (Simplest)
```
POST https://your-dividen-url/api/webhooks/calendar?webhookId=WEBHOOK_ID&secret=YOUR_SECRET
```

#### 2. Header-Based Secret
```
POST https://your-dividen-url/api/webhooks/calendar?webhookId=WEBHOOK_ID
X-Webhook-Secret: YOUR_SECRET
```

#### 3. HMAC-SHA256 Signature
```
POST https://your-dividen-url/api/webhooks/calendar?webhookId=WEBHOOK_ID
X-Webhook-Signature: sha256=COMPUTED_HMAC
```

To compute the signature:
```javascript
const crypto = require('crypto');
const signature = crypto
  .createHmac('sha256', YOUR_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

---

## Auto-Learn Field Mapping

DiviDen includes an **LLM-powered auto-learn system** that analyzes incoming webhook payloads and automatically maps fields to internal data models.

### How It Works

1. When a webhook receives its **first payload** and has no field mapping configured, DiviDen triggers a background LLM analysis
2. The LLM examines the payload structure and produces a **field map** (dot-notation paths → standard field names)
3. The mapping is saved to the webhook and used for all subsequent payloads
4. You can **manually override** any mapping in Settings → Webhooks → 🧠 Field Mapping

### Field Templates

Each webhook type has expected fields:

| Type | Fields |
|------|--------|
| Calendar | title, description, startTime, endTime, location, attendees |
| Email | subject, fromName, fromEmail, toEmail, body, snippet |
| Transcript | title, transcript, speakers, duration |
| Generic | title, content, source |

### Manual Override

1. Go to Settings → Webhooks
2. Click the **🧠 Field Mapping** button on any webhook
3. View the current mapping status (auto-learned, manual, or mixed) with confidence score
4. Edit any field's dot-notation path (e.g., change `event.summary` to `data.title`)
5. Click **Save Mapping**
6. Use **🧠 Ask Divi** to trigger a re-learn from the latest payload

### API Endpoints

- `GET /api/webhooks-management/[id]/learn` — Fetch current mapping config
- `POST /api/webhooks-management/[id]/learn` — Trigger manual re-learn (accepts optional `payload` body)

---

## Payload Formats

### Calendar Event Payload
```json
{
  "summary": "Team Standup",
  "description": "Daily standup meeting",
  "start": {
    "dateTime": "2025-01-15T09:00:00Z"
  },
  "end": {
    "dateTime": "2025-01-15T09:30:00Z"
  },
  "attendees": [
    {
      "email": "alice@example.com",
      "displayName": "Alice Johnson"
    }
  ]
}
```

**Auto-actions:**
- Creates a CalendarEvent (visible in Calendar tab)
- Creates a queue item titled "📅 Team Standup"
- Creates contacts for new attendees
- Event appears in NowPanel "Coming Up" section
- Feeds into Divi's context via Layer 12

### Email Notification Payload
```json
{
  "from": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "subject": "Project Update",
  "body": "Hi, here is the latest update on the project..."
}
```

**Auto-actions:**
- Creates an EmailMessage (visible in Inbox tab)
- Creates or finds contact for the sender
- Creates a queue notification titled "📧 Project Update"
- Unread count feeds into Divi's context via Layer 13

### Meeting Transcript Payload
```json
{
  "title": "Q1 Planning Meeting",
  "transcript": "Discussion about Q1 goals...",
  "actionItems": [
    "Review budget proposal by Friday",
    "Schedule follow-up with engineering"
  ],
  "participants": [
    { "name": "John Doe", "email": "john@example.com" }
  ]
}
```

**Auto-actions:**
- Creates a Recording (visible in Recordings tab)
- Creates a kanban card titled "📝 Q1 Planning Meeting"
- Adds action items as checklist items on the card
- Creates contacts for new participants

### Generic Payload
```json
{
  "title": "New Form Submission",
  "description": "Lead from website",
  "data": {
    "name": "Alex Brown",
    "email": "alex@example.com"
  }
}
```

**Auto-actions:**
- Creates a queue item titled "🔗 New Form Submission"

---

## Setting Up via Divi (Chat)

Instead of manual configuration, you can ask Divi to set things up:

```
You: "Set up a webhook for my Google Calendar"
Divi: Creates the webhook → gives you the URL + secret → walks you through Zapier setup

You: "Here's my OpenAI key: sk-abc123..."
Divi: Saves the key → confirms it's active → you're ready to go

You: "Add a meeting with John tomorrow at 2pm"
Divi: Creates a CalendarEvent directly → visible in Calendar tab

You: "Create a note about today's client call"
Divi: Creates a Document in Drive with your notes
```

### What Divi Can Do Directly
- Create webhook endpoints (`setup_webhook`)
- Save API keys (`save_api_key`)
- Create calendar events (`create_calendar_event`)
- Create documents (`create_document`)
- Send comms messages (`send_comms`)
- Create kanban cards, contacts, queue items

### What Divi Guides You Through
- Connecting Google Calendar (via Zapier/Apps Script)
- Connecting Gmail/Outlook (via Zapier/Make/n8n)
- Connecting meeting transcripts (Plaud, Otter, Fireflies)
- Connecting Slack, Notion, or other services

---

## Zapier Integration Examples

### Google Calendar → DiviDen

1. **Trigger**: Google Calendar → New Event
2. **Action**: Webhooks by Zapier → POST
3. **Configuration**:
   - URL: Your DiviDen calendar webhook URL
   - Payload Type: JSON
   - Data:
     ```
     summary: {{Event Title}}
     description: {{Event Description}}
     start.dateTime: {{Event Start}}
     end.dateTime: {{Event End}}
     ```

### Gmail → DiviDen

1. **Trigger**: Gmail → New Email
2. **Action**: Webhooks by Zapier → POST
3. **Configuration**:
   - URL: Your DiviDen email webhook URL
   - Payload Type: JSON
   - Data:
     ```
     from.name: {{From Name}}
     from.email: {{From Email}}
     subject: {{Subject}}
     body: {{Body Plain}}
     ```

### Otter.ai / Fireflies / Plaud → DiviDen

1. **Trigger**: Service's webhook or Zapier integration
2. **Action**: Webhooks by Zapier → POST
3. **Configuration**:
   - URL: Your DiviDen transcript webhook URL
   - Map the transcript data to the expected format
   - DiviDen auto-learns the field mapping on first payload

---

## Make (Integromat) Integration

### Setup Steps

1. Create a new scenario in Make
2. Add an **HTTP** module → Make a request
3. Configure:
   - **URL**: Your DiviDen webhook URL (from Settings → Integrations)
   - **Method**: POST
   - **Headers**: `Content-Type: application/json`, `X-Webhook-Secret: YOUR_SECRET`
   - **Body**: Map your data to the appropriate payload format
4. Connect your trigger (Google Calendar, Gmail, etc.)

---

## n8n Integration

### Setup Steps

1. Create a new workflow in n8n
2. Add your trigger node (e.g., Google Calendar, Gmail)
3. Add an **HTTP Request** node
4. Configure:
   - **Method**: POST
   - **URL**: Your DiviDen webhook URL
   - **Authentication**: Header Auth
     - Name: `X-Webhook-Secret`
     - Value: Your webhook secret
   - **Body**: JSON, map your fields
5. Activate the workflow

---

## Agent API v2

DiviDen exposes a REST API for external agents and services. All v2 endpoints require a Bearer token (created in Settings → Agent API Keys).

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/v2/kanban` | List/create kanban cards |
| PATCH/DELETE | `/api/v2/kanban/[id]` | Update/delete a card |
| GET/POST | `/api/v2/contacts` | List/create contacts |
| PATCH/DELETE | `/api/v2/contacts/[id]` | Update/delete a contact |
| GET/POST | `/api/v2/queue` | List/create queue items |
| PATCH/DELETE | `/api/v2/queue/[id]` | Update/delete a queue item |
| GET | `/api/v2/queue/[id]/status` | Check item status |
| POST | `/api/v2/queue/[id]/result` | Submit result for item |
| GET | `/api/v2/docs` | OpenAPI specification |
| GET/POST | `/api/v2/keys` | Manage API keys |
| GET/POST | `/api/v2/shared-chat/*` | Shared chat endpoints |

### Authentication

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://your-dividen-url/api/v2/kanban
```

---

## Comms Channel

The Comms Channel (`/dashboard/comms`) provides structured bidirectional messaging between the user and Divi.

### Message States
| State | Description |
|-------|------------|
| `new` | Freshly created, unread |
| `read` | Viewed by recipient |
| `acknowledged` | Actively noted |
| `resolved` | Action completed |
| `dismissed` | Intentionally ignored |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comms` | List messages (supports `?state=` filter) |
| POST | `/api/comms` | Create a message |
| PATCH | `/api/comms/[id]` | Update state/priority |
| DELETE | `/api/comms/[id]` | Delete a message |
| GET | `/api/comms/unread` | Get unread count |

Divi can also send comms messages via the `[[send_comms:...]]` action tag.

---

## Testing Webhooks

Each webhook has a **Test** button that sends a sample payload matching the webhook type. Use this to verify:

1. The webhook is configured correctly
2. Actions are being created as expected
3. Auto-learn mapping is generated on first test
4. Check the webhook logs for details

### Using cURL

```bash
# Test a calendar webhook
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_SECRET" \
  -d '{
    "summary": "Test Meeting",
    "start": {"dateTime": "2025-01-15T10:00:00Z"},
    "attendees": [{"email": "test@example.com", "displayName": "Test User"}]
  }'
```

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Rotate secrets** periodically (delete and recreate webhook)
3. **Use HMAC signatures** for critical integrations
4. **Monitor webhook logs** for unauthorized attempts
5. **Disable unused webhooks** rather than leaving them active
6. **Encrypt your database** in production for API key security

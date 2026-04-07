# DiviDen Integration Guide

## Overview

DiviDen uses a **webhook-first** integration approach. Instead of complex OAuth flows, you connect external services by creating webhook endpoints that receive data from automation platforms like Zapier, Make (Integromat), n8n, or direct API calls.

---

## Webhooks

### How It Works

1. **Create a webhook** in Settings → Integrations
2. **Choose a type**: Calendar, Email, Transcript, or Generic
3. **Copy the URL and secret** provided
4. **Configure your automation tool** (Zapier, Make, etc.) to POST data to the webhook URL
5. **DiviDen automatically processes** the data and creates tasks, contacts, cards, etc.

### Webhook Types

| Type | Endpoint | Auto-Actions |
|------|----------|-------------|
| Calendar | `/api/webhooks/calendar` | Creates queue items from events, adds attendees as contacts |
| Email | `/api/webhooks/email` | Creates contacts from senders, adds email as queue notification |
| Transcript | `/api/webhooks/transcript` | Creates kanban cards with checklists from action items, adds participant contacts |
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
    },
    {
      "email": "bob@example.com",
      "displayName": "Bob Smith"
    }
  ]
}
```

**Auto-actions:**
- Creates a queue item titled "📅 Team Standup"
- Creates contacts for new attendees

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
- Creates or finds contact for the sender
- Creates a queue notification titled "📧 Project Update"

### Meeting Transcript Payload
```json
{
  "title": "Q1 Planning Meeting",
  "transcript": "Discussion about Q1 goals...",
  "actionItems": [
    "Review budget proposal by Friday",
    "Schedule follow-up with engineering",
    "Prepare presentation for stakeholders"
  ],
  "participants": [
    { "name": "John Doe", "email": "john@example.com" },
    { "name": "Jane Smith", "email": "jane@example.com" }
  ]
}
```

**Auto-actions:**
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

### Otter.ai / Fireflies → DiviDen

1. **Trigger**: Otter.ai webhook or Fireflies webhook
2. **Action**: Webhooks by Zapier → POST
3. **Configuration**:
   - URL: Your DiviDen transcript webhook URL
   - Map the transcript data to the expected format

---

## Make (Integromat) Integration

### Setup Steps

1. Create a new scenario in Make
2. Add an **HTTP** module → Make a request
3. Configure:
   - **URL**: Your DiviDen webhook URL (from Settings → Integrations)
   - **Method**: POST
   - **Headers**: `Content-Type: application/json`
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

## Custom Mapping Rules

For advanced use cases, you can define custom mapping rules when creating a webhook. Mapping rules let you control exactly how payload data maps to DiviDen actions.

### Mapping Rule Format
```json
[
  {
    "field": "data",
    "action": "create_card",
    "mapping": {
      "title": "data.name",
      "description": "data.message",
      "priority": "\"high\""
    },
    "conditions": {
      "type": "new_lead"
    }
  }
]
```

### Available Actions
- `create_card` — Creates a Kanban card
- `create_contact` — Creates a CRM contact
- `create_queue_item` — Creates a queue item

### Mapping Syntax
- `field.path` — Extract value from payload using dot notation
- `"literal value"` — Use a literal string value (wrap in escaped quotes)

---

## Service API Keys

Store API keys for external services that DiviDen can use for outbound actions.

### Supported Services

| Service | Use Case |
|---------|----------|
| SendGrid | Sending automated emails |
| Twilio | SMS notifications |
| Slack | Posting messages to channels |
| Stripe | Payment-related actions |
| Notion | Syncing data with Notion |
| Airtable | Syncing data with Airtable |
| GitHub | Repository automation |
| Custom | Any service with an API key |

### Adding Keys

1. Go to Settings → Integrations → Service API Keys
2. Click "+ Add Key"
3. Select the service
4. Enter a label and the API key
5. Keys are stored securely (only last 4 characters visible in UI)

---

## Testing Webhooks

Each webhook has a **Test** button that sends a sample payload matching the webhook type. Use this to verify:

1. The webhook is configured correctly
2. Actions are being created as expected
3. Check the webhook logs for details

### Using cURL

```bash
# Test a calendar webhook
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test Meeting",
    "start": {"dateTime": "2025-01-15T10:00:00Z"},
    "attendees": [{"email": "test@example.com", "displayName": "Test User"}]
  }'
```

---

## Webhook Logs

All webhook requests are logged with:
- **Status**: success, error, or ignored
- **Payload**: The incoming request body
- **Actions Run**: Which actions were executed
- **Errors**: Any error messages

View logs in Settings → Integrations → Click "View Logs" on any webhook.

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Rotate secrets** periodically (delete and recreate webhook)
3. **Use HMAC signatures** for critical integrations
4. **Monitor webhook logs** for unauthorized attempts
5. **Disable unused webhooks** rather than leaving them active
6. **Encrypt your database** in production for API key security

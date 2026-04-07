/**
 * DiviDen Action Tag Parser & Executor
 * 
 * Parses [[tag_name:params]] from AI responses and executes
 * corresponding database operations.
 */

import { prisma } from './prisma';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedTag {
  raw: string;           // The full matched string including [[ ]]
  name: string;          // Tag name (e.g., "create_card")
  params: Record<string, any>; // Parsed JSON parameters
}

export interface TagExecutionResult {
  tag: string;
  success: boolean;
  data?: any;
  error?: string;
}

// ─── Tag Names ───────────────────────────────────────────────────────────────

export const SUPPORTED_TAGS = [
  'create_card',
  'update_card',
  'archive_card',
  'create_contact',
  'link_contact',
  'dispatch_queue',
  'create_event',
  'set_reminder',
  'send_email',
  'add_checklist',
  'complete_checklist',
  'update_memory',
  'save_learning',
] as const;

export type TagName = (typeof SUPPORTED_TAGS)[number];

// ─── Parser ──────────────────────────────────────────────────────────────────

/**
 * Extract all [[tag_name:params]] from a string.
 * Supports nested JSON with colons, brackets, etc.
 */
export function parseActionTags(text: string): ParsedTag[] {
  const tags: ParsedTag[] = [];

  // Match [[tag_name:{...}]] — greedy enough to capture nested JSON
  const regex = /\[\[(\w+):\s*(\{[\s\S]*?\})\s*\]\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [raw, name, jsonStr] = match;

    // Only parse supported tags
    if (!SUPPORTED_TAGS.includes(name as TagName)) {
      continue;
    }

    try {
      const params = JSON.parse(jsonStr);
      tags.push({ raw, name, params });
    } catch {
      // Try to fix common JSON issues (single quotes, trailing commas)
      try {
        const fixed = jsonStr
          .replace(/'/g, '"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        const params = JSON.parse(fixed);
        tags.push({ raw, name, params });
      } catch {
        console.warn(`[action-tags] Failed to parse params for [[${name}]]:`, jsonStr);
      }
    }
  }

  return tags;
}

/**
 * Strip all action tags from text, returning clean message for display.
 */
export function stripActionTags(text: string): string {
  return text
    .replace(/\[\[\w+:\s*\{[\s\S]*?\}\s*\]\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Executor ────────────────────────────────────────────────────────────────

/**
 * Execute a single parsed action tag against the database.
 */
async function executeTag(
  tag: ParsedTag,
  userId: string
): Promise<TagExecutionResult> {
  const { name, params } = tag;

  try {
    switch (name) {
      // ── Card Management ──────────────────────────────────────────────
      case 'create_card': {
        const card = await prisma.kanbanCard.create({
          data: {
            title: params.title || 'Untitled Card',
            description: params.description || null,
            status: params.status || 'backlog',
            priority: params.priority || 'medium',
            dueDate: params.dueDate ? new Date(params.dueDate) : null,
            userId,
          },
        });
        return { tag: name, success: true, data: { id: card.id, title: card.title } };
      }

      case 'update_card': {
        if (!params.id) return { tag: name, success: false, error: 'Missing card id' };
        const updateData: any = {};
        if (params.title) updateData.title = params.title;
        if (params.description !== undefined) updateData.description = params.description;
        if (params.status) updateData.status = params.status;
        if (params.priority) updateData.priority = params.priority;
        if (params.dueDate) updateData.dueDate = new Date(params.dueDate);

        const card = await prisma.kanbanCard.update({
          where: { id: params.id },
          data: updateData,
        });
        return { tag: name, success: true, data: { id: card.id, title: card.title } };
      }

      case 'archive_card': {
        if (!params.id) return { tag: name, success: false, error: 'Missing card id' };
        const card = await prisma.kanbanCard.update({
          where: { id: params.id },
          data: { status: 'done' },
        });
        return { tag: name, success: true, data: { id: card.id } };
      }

      // ── Checklist ────────────────────────────────────────────────────
      case 'add_checklist': {
        if (!params.cardId || !params.text) {
          return { tag: name, success: false, error: 'Missing cardId or text' };
        }
        const item = await prisma.checklistItem.create({
          data: {
            cardId: params.cardId,
            text: params.text,
            order: params.order || 0,
          },
        });
        return { tag: name, success: true, data: { id: item.id, text: item.text } };
      }

      case 'complete_checklist': {
        if (!params.id) return { tag: name, success: false, error: 'Missing checklist item id' };
        const item = await prisma.checklistItem.update({
          where: { id: params.id },
          data: { completed: params.completed !== false },
        });
        return { tag: name, success: true, data: { id: item.id, completed: item.completed } };
      }

      // ── Contacts ─────────────────────────────────────────────────────
      case 'create_contact': {
        const contact = await prisma.contact.create({
          data: {
            name: params.name || 'Unknown',
            email: params.email || null,
            phone: params.phone || null,
            company: params.company || null,
            role: params.role || null,
            notes: params.notes || null,
            tags: params.tags || null,
            userId,
          },
        });
        return { tag: name, success: true, data: { id: contact.id, name: contact.name } };
      }

      case 'link_contact': {
        if (!params.cardId || !params.contactId) {
          return { tag: name, success: false, error: 'Missing cardId or contactId' };
        }
        const link = await prisma.cardContact.create({
          data: {
            cardId: params.cardId,
            contactId: params.contactId,
            role: params.role || null,
          },
        });
        return { tag: name, success: true, data: { id: link.id } };
      }

      // ── Queue ────────────────────────────────────────────────────────
      case 'dispatch_queue': {
        const queueItem = await prisma.queueItem.create({
          data: {
            type: params.type || 'task',
            title: params.title || 'Untitled Item',
            description: params.description || null,
            priority: params.priority || 'medium',
            source: 'agent',
          },
        });
        return { tag: name, success: true, data: { id: queueItem.id, title: queueItem.title } };
      }

      // ── Calendar & Reminders ─────────────────────────────────────────
      case 'create_event':
      case 'set_reminder': {
        // Store as queue items with metadata
        const itemType = name === 'create_event' ? 'task' : 'reminder';
        const metadata = JSON.stringify({
          date: params.date,
          time: params.time,
          type: name,
        });
        const item = await prisma.queueItem.create({
          data: {
            type: itemType,
            title: params.title || (name === 'create_event' ? 'New Event' : 'Reminder'),
            description: params.description || null,
            priority: params.priority || 'medium',
            source: 'agent',
            metadata,
          },
        });
        return { tag: name, success: true, data: { id: item.id, title: item.title } };
      }

      // ── Email ────────────────────────────────────────────────────────
      case 'send_email': {
        // Store as a queue item (draft) since we don't have email integration yet
        const emailMeta = JSON.stringify({
          to: params.to,
          subject: params.subject,
          body: params.body,
          type: 'email_draft',
        });
        const item = await prisma.queueItem.create({
          data: {
            type: 'task',
            title: `Email draft: ${params.subject || 'No subject'}`,
            description: `To: ${params.to}\n\n${params.body || ''}`,
            priority: 'medium',
            source: 'agent',
            metadata: emailMeta,
          },
        });
        return { tag: name, success: true, data: { id: item.id, note: 'Saved as draft in queue' } };
      }

      // ── Memory ───────────────────────────────────────────────────────
      case 'update_memory': {
        if (!params.key || !params.value) {
          return { tag: name, success: false, error: 'Missing key or value' };
        }
        const memory = await prisma.memoryItem.upsert({
          where: {
            userId_key: { userId, key: params.key },
          },
          create: {
            category: params.category || 'context',
            key: params.key,
            value: params.value,
            source: 'agent',
            userId,
          },
          update: {
            value: params.value,
            category: params.category || undefined,
          },
        });
        return { tag: name, success: true, data: { id: memory.id, key: memory.key } };
      }

      // ── Learning ─────────────────────────────────────────────────────
      case 'save_learning': {
        if (!params.observation) {
          return { tag: name, success: false, error: 'Missing observation' };
        }
        const learning = await prisma.userLearning.create({
          data: {
            category: params.category || 'preference',
            observation: params.observation,
            confidence: typeof params.confidence === 'number' ? params.confidence : 0.5,
            userId,
          },
        });
        return { tag: name, success: true, data: { id: learning.id } };
      }

      default:
        return { tag: name, success: false, error: `Unknown tag: ${name}` };
    }
  } catch (error: any) {
    console.error(`[action-tags] Error executing [[${name}]]:`, error.message);
    return { tag: name, success: false, error: error.message };
  }
}

/**
 * Execute all parsed action tags and return results.
 */
export async function executeActionTags(
  tags: ParsedTag[],
  userId: string
): Promise<TagExecutionResult[]> {
  const results: TagExecutionResult[] = [];

  for (const tag of tags) {
    const result = await executeTag(tag, userId);
    results.push(result);
  }

  return results;
}

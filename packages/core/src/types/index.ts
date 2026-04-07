// ─── Mode Types ─────────────────────────────────────────────────────────────

export type DividenMode = 'cockpit' | 'chief_of_staff';

// ─── Kanban Types ───────────────────────────────────────────────────────────

export type CardStatus = 'leads' | 'qualifying' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type CardPriority = 'low' | 'medium' | 'high' | 'urgent';
export type CardAssignee = 'human' | 'agent';

export const KANBAN_COLUMNS: { id: CardStatus; label: string; color: string }[] = [
  { id: 'leads', label: 'Leads', color: '#94a3b8' },
  { id: 'qualifying', label: 'Qualifying', color: '#60a5fa' },
  { id: 'proposal', label: 'Proposal', color: '#a78bfa' },
  { id: 'negotiation', label: 'Negotiation', color: '#fbbf24' },
  { id: 'won', label: 'Won', color: '#34d399' },
  { id: 'lost', label: 'Lost', color: '#f87171' },
];

export interface KanbanCardData {
  id: string;
  title: string;
  description: string | null;
  status: CardStatus;
  priority: CardPriority;
  assignee: CardAssignee;
  dueDate: string | null;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItemData[];
  contacts: CardContactData[];
}

export interface ChecklistItemData {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  cardId: string;
}

export interface CardContactData {
  id: string;
  cardId: string;
  contactId: string;
  role: string | null;
  contact: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
  };
}

// ─── Queue Types ────────────────────────────────────────────────────────────

export type QueueItemType = 'task' | 'notification' | 'reminder' | 'agent_suggestion';
export type QueueItemStatus = 'ready' | 'in_progress' | 'done_today' | 'blocked';

export const QUEUE_SECTIONS: { id: QueueItemStatus; label: string; icon: string; color: string }[] = [
  { id: 'ready', label: 'Ready', icon: '🟢', color: '#34d399' },
  { id: 'in_progress', label: 'In Progress', icon: '🔵', color: '#60a5fa' },
  { id: 'done_today', label: 'Done Today', icon: '✅', color: '#a78bfa' },
  { id: 'blocked', label: 'Blocked', icon: '🔴', color: '#f87171' },
];

export interface QueueItemData {
  id: string;
  type: QueueItemType;
  title: string;
  description: string | null;
  priority: CardPriority;
  status: QueueItemStatus;
  source: string | null;
  userId: string | null;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Chat Types ─────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant' | 'system';

// ─── Agent Types ────────────────────────────────────────────────────────────

export type AgentProvider = 'openai' | 'anthropic';
export type AgentMessageType = 'status_update' | 'suggestion' | 'alert' | 'completion';

// ─── Memory Types ───────────────────────────────────────────────────────────

export type MemoryCategory = 'preference' | 'context' | 'fact' | 'instruction';
export type LearningCategory = 'style' | 'preference' | 'workflow' | 'communication';

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Dashboard Tab Types ────────────────────────────────────────────────────

export type CenterTab = 'chat' | 'kanban' | 'crm';

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface SetupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

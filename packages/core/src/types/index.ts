// ─── Mode Types ─────────────────────────────────────────────────────────────

export type DividenMode = 'cockpit' | 'chief_of_staff';

// ─── Kanban Types ───────────────────────────────────────────────────────────

export type CardStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type CardPriority = 'low' | 'medium' | 'high' | 'urgent';

// ─── Queue Types ────────────────────────────────────────────────────────────

export type QueueItemType = 'task' | 'notification' | 'reminder' | 'agent_suggestion';
export type QueueItemStatus = 'pending' | 'accepted' | 'dismissed';

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

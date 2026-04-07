/**
 * DiviDen Command Center Configuration
 * 
 * Customize your Command Center behavior here.
 * See docs for all available options.
 */

export interface DividenConfig {
  /** Application name shown in the UI */
  name: string;
  /** Default operating mode */
  defaultMode: 'cockpit' | 'chief_of_staff';
  /** Port to run the dev/production server on */
  port: number;
  /** AI provider configuration */
  ai: {
    /** Default AI provider */
    defaultProvider: 'openai' | 'anthropic';
    /** OpenAI model to use */
    openaiModel: string;
    /** Anthropic model to use */
    anthropicModel: string;
    /** Maximum tokens per response */
    maxTokens: number;
    /** Temperature for AI responses (0-1) */
    temperature: number;
  };
  /** Kanban board configuration */
  kanban: {
    /** Pipeline stages (columns) */
    stages: { id: string; label: string; color: string }[];
  };
  /** Dashboard configuration */
  dashboard: {
    /** Default center panel tab */
    defaultTab: 'chat' | 'kanban' | 'crm';
    /** Show the NOW panel */
    showNowPanel: boolean;
    /** Show the Queue panel */
    showQueuePanel: boolean;
  };
}

const config: DividenConfig = {
  name: 'DiviDen Command Center',
  defaultMode: 'cockpit',
  port: 3000,
  ai: {
    defaultProvider: 'openai',
    openaiModel: 'gpt-4-turbo-preview',
    anthropicModel: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    temperature: 0.7,
  },
  kanban: {
    stages: [
      { id: 'leads', label: 'Leads', color: '#94a3b8' },
      { id: 'qualifying', label: 'Qualifying', color: '#60a5fa' },
      { id: 'proposal', label: 'Proposal', color: '#a78bfa' },
      { id: 'negotiation', label: 'Negotiation', color: '#fbbf24' },
      { id: 'won', label: 'Won', color: '#34d399' },
      { id: 'lost', label: 'Lost', color: '#f87171' },
    ],
  },
  dashboard: {
    defaultTab: 'chat',
    showNowPanel: true,
    showQueuePanel: true,
  },
};

export default config;

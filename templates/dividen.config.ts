/**
 * DiviDen Command Center Configuration
 * 
 * Customize your Command Center behavior here.
 * See docs for all available options: https://github.com/jonnyuniverse/dividenapp
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
    defaultProvider: 'openai' | 'anthropic';
    openaiModel: string;
    anthropicModel: string;
    maxTokens: number;
    temperature: number;
  };
  /** Kanban board configuration */
  kanban: {
    stages: { id: string; label: string; color: string }[];
  };
  /** Dashboard configuration */
  dashboard: {
    defaultTab: 'chat' | 'board' | 'crm' | 'calendar' | 'inbox' | 'recordings' | 'drive';
    showNowPanel: boolean;
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
      { id: 'contracted', label: 'Contracted', color: '#2dd4bf' },
      { id: 'active', label: 'Active', color: '#34d399' },
      { id: 'development', label: 'Development', color: '#818cf8' },
      { id: 'planning', label: 'Planning', color: '#c084fc' },
      { id: 'paused', label: 'Paused', color: '#fb923c' },
      { id: 'completed', label: 'Completed', color: '#4ade80' },
    ],
  },
  dashboard: {
    defaultTab: 'chat',
    showNowPanel: true,
    showQueuePanel: true,
  },
};

export default config;

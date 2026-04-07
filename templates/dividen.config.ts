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
  dashboard: {
    defaultTab: 'chat',
    showNowPanel: true,
    showQueuePanel: true,
  },
};

export default config;

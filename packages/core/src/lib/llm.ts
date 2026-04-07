/**
 * DiviDen LLM Provider Integration
 * 
 * Supports OpenAI (GPT-4) and Anthropic (Claude Sonnet) with streaming.
 * Includes fallback logic if one provider fails.
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from './prisma';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LLMProvider = 'openai' | 'anthropic';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: Error) => void;
}

// ─── API Key Retrieval ───────────────────────────────────────────────────────

async function getApiKey(provider: LLMProvider): Promise<string | null> {
  const key = await prisma.agentApiKey.findFirst({
    where: { provider, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return key?.apiKey || null;
}

/**
 * Determine which provider to use based on available keys.
 * Prefers OpenAI, falls back to Anthropic.
 */
export async function getAvailableProvider(): Promise<{
  provider: LLMProvider;
  apiKey: string;
} | null> {
  // Try OpenAI first
  const openaiKey = await getApiKey('openai');
  if (openaiKey) return { provider: 'openai', apiKey: openaiKey };

  // Fallback to Anthropic
  const anthropicKey = await getApiKey('anthropic');
  if (anthropicKey) return { provider: 'anthropic', apiKey: anthropicKey };

  return null;
}

// ─── OpenAI Streaming ────────────────────────────────────────────────────────

async function streamOpenAI(
  apiKey: string,
  messages: LLMMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  const client = new OpenAI({ apiKey });

  try {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 4096,
      temperature: 0.7,
      stream: true,
    });

    let fullText = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        callbacks.onToken(delta);
      }
    }

    callbacks.onDone(fullText);
  } catch (error: any) {
    callbacks.onError(new Error(`OpenAI error: ${error.message}`));
  }
}

// ─── Anthropic Streaming ─────────────────────────────────────────────────────

async function streamAnthropic(
  apiKey: string,
  messages: LLMMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  const client = new Anthropic({ apiKey });

  // Anthropic uses a separate system parameter
  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemMsg?.content || '',
      messages: chatMessages,
    });

    let fullText = '';

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const text = event.delta.text;
        fullText += text;
        callbacks.onToken(text);
      }
    }

    callbacks.onDone(fullText);
  } catch (error: any) {
    callbacks.onError(new Error(`Anthropic error: ${error.message}`));
  }
}

// ─── Main Streaming Function ─────────────────────────────────────────────────

/**
 * Stream LLM response with automatic provider selection and fallback.
 */
export async function streamLLMResponse(
  messages: LLMMessage[],
  callbacks: StreamCallbacks,
  preferredProvider?: LLMProvider
): Promise<void> {
  // Get available providers
  const providers: { provider: LLMProvider; apiKey: string }[] = [];

  const openaiKey = await getApiKey('openai');
  const anthropicKey = await getApiKey('anthropic');

  if (openaiKey) providers.push({ provider: 'openai', apiKey: openaiKey });
  if (anthropicKey) providers.push({ provider: 'anthropic', apiKey: anthropicKey });

  if (providers.length === 0) {
    callbacks.onError(
      new Error('No API keys configured. Please add an OpenAI or Anthropic API key in Settings.')
    );
    return;
  }

  // Sort preferred provider first
  if (preferredProvider) {
    providers.sort((a, b) =>
      a.provider === preferredProvider ? -1 : b.provider === preferredProvider ? 1 : 0
    );
  }

  // Try each provider with fallback
  for (let i = 0; i < providers.length; i++) {
    const { provider, apiKey } = providers[i];
    const isLast = i === providers.length - 1;

    try {
      if (provider === 'openai') {
        await streamOpenAI(apiKey, messages, {
          onToken: callbacks.onToken,
          onDone: callbacks.onDone,
          onError: (error) => {
            if (isLast) {
              callbacks.onError(error);
            } else {
              console.warn(`[llm] ${provider} failed, trying fallback:`, error.message);
              // Will continue to next provider in loop
            }
          },
        });
      } else {
        await streamAnthropic(apiKey, messages, {
          onToken: callbacks.onToken,
          onDone: callbacks.onDone,
          onError: (error) => {
            if (isLast) {
              callbacks.onError(error);
            } else {
              console.warn(`[llm] ${provider} failed, trying fallback:`, error.message);
            }
          },
        });
      }

      // If we got here without throwing, the stream succeeded
      return;
    } catch (error: any) {
      if (isLast) {
        callbacks.onError(error);
      } else {
        console.warn(`[llm] ${provider} threw, trying fallback:`, error.message);
      }
    }
  }
}

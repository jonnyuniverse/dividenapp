'use client';

import { useState } from 'react';

export function ChatView() {
  const [message, setMessage] = useState('');

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-5xl mb-4 opacity-20">⬡</div>
          <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
            DiviDen Command Center
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-md">
            Chat with your AI agent. Ask questions, delegate tasks, or get
            status updates on your projects.
          </p>
          <div className="flex gap-2 mt-4">
            <button className="btn-secondary text-sm">
              📊 What&apos;s my status?
            </button>
            <button className="btn-secondary text-sm">
              ➕ Create a task
            </button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-[var(--border-color)] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to your AI agent..."
            className="input-field flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // TODO: Send message (Phase 3)
                setMessage('');
              }
            }}
          />
          <button
            className="btn-primary px-6"
            onClick={() => {
              // TODO: Send message (Phase 3)
              setMessage('');
            }}
          >
            Send
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          AI chat will be connected in Phase 3. Configure API keys in Settings.
        </p>
      </div>
    </div>
  );
}

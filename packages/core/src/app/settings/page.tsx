'use client';

import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/settings/ModeToggle';
import { ApiKeyManager } from '@/components/settings/ApiKeyManager';
import { MemoryPanel } from '@/components/dashboard/MemoryPanel';
import { ExternalKeyManager } from '@/components/settings/ExternalKeyManager';

interface SettingsData {
  user: {
    id: string;
    name: string;
    email: string;
    mode: string;
    role: string;
  };
  apiKeys: Array<{
    id: string;
    provider: string;
    label: string | null;
    isActive: boolean;
    createdAt: string;
  }>;
}

interface MemoryStats {
  total: number;
  tier1: number;
  tier2: number;
  tier3: number;
  pinned: number;
  approved: number;
  pending: number;
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [showMemoryManager, setShowMemoryManager] = useState(false);
  const [clearingMemory, setClearingMemory] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));

    // Fetch memory stats
    fetch('/api/memory')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const items = res.data || [];
          setMemoryStats({
            total: items.length,
            tier1: items.filter((i: any) => i.tier === 1).length,
            tier2: items.filter((i: any) => i.tier === 2).length,
            tier3: items.filter((i: any) => i.tier === 3).length,
            pinned: items.filter((i: any) => i.pinned).length,
            approved: items.filter((i: any) => i.approved === true).length,
            pending: items.filter((i: any) => i.tier === 3 && i.approved === null).length,
          });
        }
      });
  }, []);

  const handleClearOldMemories = async () => {
    if (!confirm('This will delete all Tier 3 patterns with confidence below 0.3. Continue?')) return;
    setClearingMemory(true);
    try {
      const res = await fetch('/api/memory?tier=3');
      const data = await res.json();
      if (data.success) {
        const lowConfidence = data.data.filter((i: any) => (i.confidence || 0) < 0.3);
        for (const item of lowConfidence) {
          await fetch(`/api/memory/${item.id}`, { method: 'DELETE' });
        }
        // Refresh stats
        window.location.reload();
      }
    } finally {
      setClearingMemory(false);
    }
  };

  const handleExportMemory = async () => {
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dividen-memory-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse text-[var(--text-secondary)]">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Configure your DiviDen Command Center
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="font-semibold">Operating Mode</h2>
        </div>
        <div className="panel-body">
          <ModeToggle
            currentMode={(data?.user?.mode as 'cockpit' | 'chief_of_staff') || 'cockpit'}
            onModeChange={async (mode) => {
              await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
              });
              setData((prev) =>
                prev ? { ...prev, user: { ...prev.user, mode } } : prev
              );
            }}
          />
        </div>
      </div>

      {/* Memory Management */}
      <div className="panel">
        <div className="panel-header flex items-center justify-between">
          <h2 className="font-semibold">Memory Management</h2>
          <button
            onClick={() => setShowMemoryManager(!showMemoryManager)}
            className="text-sm text-brand-400 hover:text-brand-300"
          >
            {showMemoryManager ? 'Hide Manager' : 'Open Manager'}
          </button>
        </div>
        <div className="panel-body">
          {/* Stats */}
          {memoryStats && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                <div className="text-2xl font-bold text-brand-400">{memoryStats.total}</div>
                <div className="text-xs text-[var(--text-muted)]">Total Items</div>
              </div>
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">{memoryStats.tier1}</div>
                <div className="text-xs text-[var(--text-muted)]">📌 Facts</div>
              </div>
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">{memoryStats.tier2}</div>
                <div className="text-xs text-[var(--text-muted)]">📏 Rules</div>
              </div>
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{memoryStats.tier3}</div>
                <div className="text-xs text-[var(--text-muted)]">🧠 Patterns</div>
              </div>
            </div>
          )}

          {memoryStats && (memoryStats.pinned > 0 || memoryStats.pending > 0) && (
            <div className="flex gap-4 mb-4 text-sm text-[var(--text-secondary)]">
              {memoryStats.pinned > 0 && (
                <span>📌 {memoryStats.pinned} pinned</span>
              )}
              {memoryStats.approved > 0 && (
                <span>✓ {memoryStats.approved} approved</span>
              )}
              {memoryStats.pending > 0 && (
                <span className="text-yellow-400">⏳ {memoryStats.pending} pending review</span>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExportMemory}
              className="text-sm px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-md hover:bg-brand-600/20 text-[var(--text-secondary)] hover:text-brand-400 transition-colors"
            >
              📤 Export All
            </button>
            <button
              onClick={handleClearOldMemories}
              disabled={clearingMemory}
              className="text-sm px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-md hover:bg-red-600/10 text-[var(--text-secondary)] hover:text-red-400 transition-colors disabled:opacity-50"
            >
              {clearingMemory ? '🔄 Clearing...' : '🗑 Clear Low-Confidence'}
            </button>
          </div>

          {/* Inline Memory Manager */}
          {showMemoryManager && (
            <div className="mt-4 border-t border-[var(--border-primary)] pt-4 h-[500px]">
              <MemoryPanel />
            </div>
          )}
        </div>
      </div>

      {/* Agent API Keys (v2) */}
      <div className="panel">
        <div className="panel-header flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Agent API Keys</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Bearer tokens for external AI agents to connect via the v2 API
            </p>
          </div>
          <a
            href="/api/v2/docs"
            target="_blank"
            className="text-xs text-brand-400 hover:text-brand-300"
          >
            📄 API Docs
          </a>
        </div>
        <div className="panel-body">
          <ExternalKeyManager />
        </div>
      </div>


      {/* API Keys */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="font-semibold">AI Provider API Keys</h2>
        </div>
        <div className="panel-body">
          <ApiKeyManager
            apiKeys={data?.apiKeys || []}
            onKeyAdded={(key) => {
              setData((prev) =>
                prev ? { ...prev, apiKeys: [...prev.apiKeys, key] } : prev
              );
            }}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="font-semibold">Account</h2>
        </div>
        <div className="panel-body space-y-3">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Name</span>
            <span>{data?.user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Email</span>
            <span>{data?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Role</span>
            <span className="capitalize">{data?.user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
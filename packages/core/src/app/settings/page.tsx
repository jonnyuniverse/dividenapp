'use client';

import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/settings/ModeToggle';
import { ApiKeyManager } from '@/components/settings/ApiKeyManager';

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

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

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

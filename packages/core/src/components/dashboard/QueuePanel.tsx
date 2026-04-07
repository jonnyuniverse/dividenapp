'use client';

export function QueuePanel() {
  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-brand-400">
          📥 Queue
        </h2>
        <span className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full text-[var(--text-muted)]">
          0
        </span>
      </div>

      <div className="panel-body flex-1 overflow-y-auto">
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-4xl mb-3 opacity-30">📥</div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">
            Queue is empty
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Agent suggestions, tasks, and notifications will appear here.
          </p>
        </div>
      </div>

      {/* Queue filters */}
      <div className="border-t border-[var(--border-color)] p-3">
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 rounded bg-brand-600/20 text-brand-400">
            All
          </button>
          <button className="text-xs px-2 py-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
            Tasks
          </button>
          <button className="text-xs px-2 py-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
            Alerts
          </button>
        </div>
      </div>
    </div>
  );
}

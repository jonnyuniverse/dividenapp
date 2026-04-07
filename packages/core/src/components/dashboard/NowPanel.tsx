'use client';

export function NowPanel() {
  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-brand-400">
          ⚡ NOW
        </h2>
        <span className="text-xs text-[var(--text-muted)]">Focus Mode</span>
      </div>

      <div className="panel-body flex-1 flex flex-col">
        {/* Current Focus Card */}
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Active</span>
          </div>
          <h3 className="font-medium mb-1">No active task</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Drag a card here or start a new task to begin.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Quick Actions
          </h4>
          <button className="w-full btn-secondary text-sm text-left">
            + New Task
          </button>
          <button className="w-full btn-secondary text-sm text-left">
            💬 Quick Chat
          </button>
        </div>

        {/* Today's Progress */}
        <div className="mt-auto pt-4">
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Today&apos;s Progress
          </h4>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-secondary)]">Completed</span>
              <span className="font-medium">0 / 0</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

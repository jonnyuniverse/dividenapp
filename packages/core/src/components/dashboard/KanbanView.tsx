'use client';

const columns = [
  { id: 'backlog', label: 'Backlog', color: 'text-gray-400' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-400' },
  { id: 'review', label: 'Review', color: 'text-yellow-400' },
  { id: 'done', label: 'Done', color: 'text-green-400' },
];

export function KanbanView() {
  return (
    <div className="h-full p-4 overflow-x-auto">
      <div className="flex gap-3 h-full min-w-[800px]">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-1 bg-[var(--bg-tertiary)]/50 rounded-lg flex flex-col"
          >
            {/* Column Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">
                  0
                </span>
              </div>
              <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg leading-none">
                +
              </button>
            </div>

            {/* Cards Area */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {/* Empty State */}
              <div className="border border-dashed border-[var(--border-color)] rounded-lg p-4 text-center">
                <p className="text-xs text-[var(--text-muted)]">
                  No cards yet
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

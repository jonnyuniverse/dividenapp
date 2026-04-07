'use client';

export function CrmView() {
  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Contacts</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your contacts and relationships
          </p>
        </div>
        <button className="btn-primary text-sm">+ Add Contact</button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center h-[60%] text-center">
        <div className="text-5xl mb-4 opacity-20">👥</div>
        <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
          No contacts yet
        </h3>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          Add contacts to track relationships and link them to your tasks and
          projects.
        </p>
      </div>
    </div>
  );
}

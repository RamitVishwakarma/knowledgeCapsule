"use client";

import { Archive } from "lucide-react";

export function DocumentDetailArchivedBanner() {
  return (
    <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <Archive className="size-4 shrink-0 text-amber-600" />
      <div className="flex-1">
        <p className="text-sm text-amber-800">This recording is archived.</p>
        <p className="text-xs text-amber-600">
          Restore it to move back to its topic, or delete it permanently.
        </p>
      </div>
    </div>
  );
}

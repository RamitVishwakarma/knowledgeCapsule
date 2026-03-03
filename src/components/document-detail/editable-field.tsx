"use client";

import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableFieldProps {
  draft: string;
  isSaving: boolean;
  inputClassName: string;
  showCancelButton?: boolean;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onCancelEdit: () => void;
}

export function EditableField({
  draft,
  isSaving,
  inputClassName,
  showCancelButton = true,
  onDraftChange,
  onSave,
  onCancelEdit,
}: EditableFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        className={inputClassName}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancelEdit();
        }}
      />
      <Button size="icon" onClick={onSave} disabled={isSaving}>
        <Save className="size-4" />
      </Button>
      {showCancelButton && (
        <Button variant="ghost" size="icon" onClick={onCancelEdit}>
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

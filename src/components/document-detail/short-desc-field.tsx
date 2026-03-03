"use client";

import { Edit3 } from "lucide-react";
import type { useEditField } from "@/utils/hooks/useEditField";
import { EditableField } from "@/components/document-detail/editable-field";

interface DocumentDetailShortDescFieldProps {
  shortDescription: string;
  isArchived: boolean;
  isSaving: boolean;
  field: ReturnType<typeof useEditField>;
  onSave: (value: string) => void;
}

export function DocumentDetailShortDescField({
  shortDescription,
  isArchived,
  isSaving,
  field,
  onSave,
}: DocumentDetailShortDescFieldProps) {
  if (field.isEditing && !isArchived) {
    return (
      <EditableField
        draft={field.draft}
        isSaving={isSaving}
        inputClassName="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg text-sm outline-none"
        showCancelButton={false}
        onDraftChange={field.setDraft}
        onSave={() => {
          onSave(field.draft);
          field.cancelEdit();
        }}
        onCancelEdit={field.cancelEdit}
      />
    );
  }

  return (
    <div
      className={`group flex items-center gap-2 ${!isArchived ? "cursor-pointer" : ""}`}
      onClick={() => {
        if (!isArchived) field.startEdit(shortDescription);
      }}
    >
      <p className="text-muted-foreground flex-1 text-sm">
        {shortDescription || (isArchived ? "No description" : "Add a short description...")}
      </p>
      {!isArchived && (
        <Edit3 className="text-muted-foreground/0 group-hover:text-muted-foreground size-3.5" />
      )}
    </div>
  );
}

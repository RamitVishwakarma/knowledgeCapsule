"use client";

import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useEditField } from "@/utils/hooks/useEditField";
import { EditableField } from "@/components/document-detail/editable-field";

interface DocumentDetailTitleFieldProps {
  title: string;
  isArchived: boolean;
  isSaving: boolean;
  field: ReturnType<typeof useEditField>;
  onSave: (value: string) => void;
}

export function DocumentDetailTitleField({
  title,
  isArchived,
  isSaving,
  field,
  onSave,
}: DocumentDetailTitleFieldProps) {
  if (field.isEditing && !isArchived) {
    return (
      <EditableField
        draft={field.draft}
        isSaving={isSaving}
        inputClassName="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg outline-none text-foreground"
        showCancelButton
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
    <div className="group flex items-start gap-2">
      <h1 className={`text-foreground flex-1 ${isArchived ? "opacity-70" : ""}`}>{title}</h1>
      {!isArchived && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => field.startEdit(title)}
          className="text-muted-foreground/0 group-hover:text-muted-foreground hover:text-primary size-8"
        >
          <Edit3 className="size-4" />
        </Button>
      )}
    </div>
  );
}

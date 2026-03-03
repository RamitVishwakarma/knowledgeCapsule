"use client";

import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/tiptap-editor";
import DOMPurify from "dompurify";
import type { useEditField } from "@/utils/hooks/useEditField";

interface DocumentDetailNotesSectionProps {
  longDescription: string;
  isArchived: boolean;
  isSaving: boolean;
  field: ReturnType<typeof useEditField>;
  onSave: (value: string) => void;
}

export function DocumentDetailNotesSection({
  longDescription,
  isArchived,
  isSaving,
  field,
  onSave,
}: DocumentDetailNotesSectionProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-foreground text-sm">Notes for future me</h4>
        {!isArchived && (
          <Button
            variant="ghost"
            onClick={() => {
              if (field.isEditing) {
                field.cancelEdit();
              } else {
                field.startEdit(longDescription);
              }
            }}
            className="text-muted-foreground hover:text-primary h-auto gap-1 px-2 py-1 text-sm"
          >
            <Edit3 className="size-3.5" />
            {field.isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </div>

      {field.isEditing && !isArchived ? (
        <div>
          <TiptapEditor content={field.draft} onChange={field.setDraft} minHeight="100px" />
          <Button
            onClick={() => {
              onSave(field.draft);
              field.cancelEdit();
            }}
            disabled={isSaving}
            className="mt-2 text-sm"
          >
            {isSaving ? "Saving..." : "Save notes"}
          </Button>
        </div>
      ) : longDescription ? (
        <div
          className="prose prose-sm text-foreground/80 max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(longDescription) }}
        />
      ) : (
        <p className="text-muted-foreground text-sm">
          {isArchived
            ? "No notes."
            : "No notes yet. Click edit to add context for your future self."}
        </p>
      )}
    </div>
  );
}

"use client";

import { ChevronDown, ChevronUp, Edit3, Download, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Document } from "@/lib/types";
import type { useEditField } from "@/utils/hooks/useEditField";

interface DocumentDetailTranscriptSectionProps {
  doc: Document;
  isArchived: boolean;
  showTranscript: boolean;
  onToggleTranscript: () => void;
  field: ReturnType<typeof useEditField>;
  isFetchingTranscript: boolean;
  isSaving: boolean;
  onFetchTranscript: () => void;
  onSaveTranscript: () => void;
}

export function DocumentDetailTranscriptSection({
  doc,
  isArchived,
  showTranscript,
  onToggleTranscript,
  field,
  isFetchingTranscript,
  isSaving,
  onFetchTranscript,
  onSaveTranscript,
}: DocumentDetailTranscriptSectionProps) {
  const sourceConfig: Record<string, { label: string; className: string }> = {
    youtube: { label: "YouTube", className: "bg-red-50 text-red-600" },
    manual: { label: "Manual", className: "bg-blue-50 text-blue-600" },
  };

  const currentSource = sourceConfig[doc.transcriptSource || ""] || {
    label: "None",
    className: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <Button
        variant="ghost"
        onClick={onToggleTranscript}
        className="h-auto w-full justify-between px-0 hover:bg-transparent"
      >
        <div className="flex items-center gap-3">
          <h4 className="text-foreground text-sm">Transcript</h4>
          <span className={`rounded px-2 py-0.5 text-xs ${currentSource.className}`}>
            {currentSource.label}
          </span>
        </div>
        {showTranscript ? (
          <ChevronUp className="text-muted-foreground size-4" />
        ) : (
          <ChevronDown className="text-muted-foreground size-4" />
        )}
      </Button>

      {showTranscript && (
        <div className="border-border mt-3 border-t pt-3">
          {field.isEditing && !isArchived && (
            <div>
              <textarea
                value={field.draft}
                onChange={(e) => field.setDraft(e.target.value)}
                rows={8}
                className="bg-input-background border-border focus:border-primary w-full resize-none rounded-lg border px-3 py-2.5 font-mono text-sm outline-none"
              />
              <div className="mt-2 flex gap-2">
                <Button onClick={onSaveTranscript} disabled={isSaving} className="text-sm">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={field.cancelEdit} className="text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!field.isEditing && !doc.transcript && doc.videoProvider === "youtube" && !isArchived && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground mb-3 text-sm">
                No transcript yet. Try fetching it from YouTube.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={onFetchTranscript}
                  disabled={isFetchingTranscript}
                  className="gap-1.5 text-sm"
                >
                  {isFetchingTranscript ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  {isFetchingTranscript ? "Fetching..." : "Fetch from YouTube"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => field.startEdit("")}
                  className="gap-1.5 text-sm"
                >
                  <Edit3 className="size-3.5" /> Paste manually
                </Button>
              </div>
            </div>
          )}

          {!field.isEditing && !doc.transcript && doc.videoProvider !== "youtube" && !isArchived && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground mb-3 text-sm">
                No transcript available for this recording.
              </p>
              <Button
                variant="secondary"
                onClick={() => field.startEdit("")}
                className="gap-1.5 text-sm"
              >
                <Edit3 className="size-3.5" /> Paste transcript manually
              </Button>
            </div>
          )}

          {!field.isEditing && doc.transcript && (
            <>
              <p className="text-muted-foreground max-h-60 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {doc.transcript}
              </p>
              <div className="mt-3 flex gap-2">
                {!isArchived && (
                  <Button
                    variant="link"
                    onClick={() => field.startEdit(doc.transcript ?? "")}
                    className="text-primary h-auto gap-1 p-0 text-sm"
                  >
                    <Edit3 className="size-3.5" /> Edit transcript
                  </Button>
                )}
                <Button
                  variant="link"
                  onClick={() => {
                    navigator.clipboard.writeText(doc.transcript ?? "");
                    toast.success("Copied!");
                  }}
                  className="text-muted-foreground hover:text-foreground h-auto gap-1 p-0 text-sm"
                >
                  <Copy className="size-3.5" /> Copy
                </Button>
              </div>
            </>
          )}

          <p className="text-muted-foreground/50 mt-3 text-xs">
            Summaries are generated from available transcripts and are fully editable.
          </p>
        </div>
      )}
    </div>
  );
}

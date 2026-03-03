"use client";

import type { ElementType } from "react";
import { Loader2, RefreshCw, AlertCircle, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/tiptap-editor";
import type { Document } from "@/lib/types";
import type { STATUS_CONFIG } from "@/lib/constants/document";

interface DocumentDetailSummarySectionProps {
  doc: Document;
  isArchived: boolean;
  status: (typeof STATUS_CONFIG)[Document["summaryStatus"]];
  StatusIcon: ElementType;
  isGenerating: boolean;
  onSaveSummary: (html: string) => void;
  onGenerateSummary: () => void;
}

export function DocumentDetailSummarySection({
  doc,
  isArchived,
  status,
  StatusIcon,
  isGenerating,
  onSaveSummary,
  onGenerateSummary,
}: DocumentDetailSummarySectionProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-foreground">Summary</h4>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${status.className}`}
          >
            <StatusIcon
              className={`size-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`}
            />
            {status.label}
          </div>
        </div>
        {doc.summaryStatus !== "processing" && !isArchived && doc.transcript && (
          <Button
            variant="outline"
            onClick={onGenerateSummary}
            disabled={isGenerating}
            className="text-primary border-primary/20 hover:bg-primary/5 gap-1.5 text-sm"
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            {isGenerating ? "Generating..." : doc.summary ? "Regenerate" : "Generate"}
          </Button>
        )}
      </div>

      {doc.summaryStatus === "processing" ? (
        <div className="py-12 text-center">
          <Loader2 className="text-primary mx-auto mb-3 size-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Generating summary from transcript...</p>
          <p className="text-muted-foreground/50 mt-1 text-xs">This usually takes a few seconds</p>
        </div>
      ) : doc.summaryStatus === "failed" ? (
        <div className="py-8 text-center">
          <AlertCircle className="text-destructive/50 mx-auto mb-3 size-8" />
          <p className="text-foreground mb-1 text-sm">Summary generation failed</p>
          <p className="text-muted-foreground mb-4 text-sm">
            The transcript may be too short or the API request failed.
          </p>
          {!isArchived && doc.transcript && (
            <Button onClick={onGenerateSummary} disabled={isGenerating} className="gap-1.5 text-sm">
              <RefreshCw className="size-3.5" /> Try again
            </Button>
          )}
        </div>
      ) : doc.summary ? (
        <TiptapEditor
          content={doc.summary}
          onChange={(html) => onSaveSummary(html)}
          editable={!isArchived}
          minHeight="200px"
        />
      ) : (
        <div className="py-8 text-center">
          <FileText className="text-muted-foreground/30 mx-auto mb-3 size-8" />
          <p className="text-muted-foreground mb-1 text-sm">No summary yet</p>
          <p className="text-muted-foreground/60 mb-4 text-sm">
            {doc.transcript
              ? "Generate a summary from the available transcript."
              : "Add a transcript first to generate a summary."}
          </p>
          {doc.transcript && !isArchived && (
            <Button onClick={onGenerateSummary} disabled={isGenerating} className="gap-1.5 text-sm">
              <Sparkles className="size-3.5" /> Generate summary
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { Play } from "lucide-react";
import type { Document } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/constants/document";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  doc: Document;
  onClick: () => void;
}

export function DocumentCard({ doc, onClick }: DocumentCardProps) {
  const status = STATUS_CONFIG[doc.summaryStatus];
  const StatusIcon = status.icon;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="border-border bg-card hover:border-primary/30 hover:shadow-primary/5 group h-auto w-full rounded-xl border p-4 text-left transition-all hover:shadow-md"
    >
      <div className="flex w-full items-start gap-4">
        <div className="bg-secondary group-hover:bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors">
          <Play className="text-primary size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-foreground truncate">{doc.title}</h4>
              {doc.shortDescription && (
                <p className="text-muted-foreground mt-0.5 truncate text-sm">
                  {doc.shortDescription}
                </p>
              )}
            </div>
            <div
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs ${status.className}`}
            >
              <StatusIcon
                className={`size-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`}
              />
              {status.label}
            </div>
          </div>
          {doc.summary && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
              {doc.summary
                .replace(/<[^>]*>/g, "")
                .replace(/[#*]/g, "")
                .substring(0, 150)}
              ...
            </p>
          )}
          <div className="text-muted-foreground/60 mt-2 flex items-center gap-3 text-xs">
            <span>Recorded {new Date(doc.createdAt).toLocaleDateString()}</span>
            {doc.transcriptSource && <span>Transcript: {doc.transcriptSource}</span>}
          </div>
        </div>
      </div>
    </Button>
  );
}

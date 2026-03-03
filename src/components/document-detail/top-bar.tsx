"use client";

import type { ElementType } from "react";
import { ArrowLeft, Archive, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { STATUS_CONFIG } from "@/lib/constants/document";
import type { Document } from "@/lib/types";

interface DocumentDetailTopBarProps {
  status: (typeof STATUS_CONFIG)[Document["summaryStatus"]];
  StatusIcon: ElementType;
  summaryStatus: Document["summaryStatus"];
  isArchived: boolean;
  isSaving: boolean;
  onBack: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onShowPermanentDelete: () => void;
}

export function DocumentDetailTopBar({
  status,
  StatusIcon,
  summaryStatus,
  isArchived,
  isSaving,
  onBack,
  onArchive,
  onRestore,
  onShowPermanentDelete,
}: DocumentDetailTopBarProps) {
  return (
    <div className="bg-background/95 border-border sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3 backdrop-blur-sm">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex h-auto items-center gap-2 px-2 text-sm"
      >
        <ArrowLeft className="size-4" />
        {isArchived ? "Back to archive" : "Back to list"}
      </Button>
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${status.className}`}
        >
          <StatusIcon
            className={`size-3 ${summaryStatus === "processing" ? "animate-spin" : ""}`}
          />
          {status.label}
        </div>

        {isArchived ? (
          <>
            <Button
              variant="ghost"
              onClick={onRestore}
              disabled={isSaving}
              className="text-primary hover:bg-primary/5 gap-1.5 text-sm"
            >
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Restore</span>
            </Button>
            <Button
              variant="ghost"
              onClick={onShowPermanentDelete}
              className="text-destructive hover:bg-destructive/5 gap-1.5 text-sm"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onArchive}
            className="text-muted-foreground hover:text-foreground"
            title="Move to archive"
          >
            <Archive className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

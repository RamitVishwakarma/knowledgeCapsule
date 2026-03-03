"use client";

import { Play, RotateCcw, Trash2, Clock } from "lucide-react";
import type { Document } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ArchivedDocumentCardProps {
  doc: Document;
  deleteConfirmId: string | null;
  isPending: boolean;
  onView: () => void;
  onRestore: () => void;
  onConfirmDelete: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
}

export function ArchivedDocumentCard({
  doc,
  deleteConfirmId,
  isPending,
  onView,
  onRestore,
  onConfirmDelete,
  onDelete,
  onCancelDelete,
}: ArchivedDocumentCardProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="flex items-start gap-4">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Play className="text-muted-foreground size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="min-w-0">
            <Button
              variant="ghost"
              onClick={onView}
              className="text-foreground hover:text-primary h-auto p-0 text-left hover:bg-transparent"
            >
              <h4 className="truncate">{doc.title}</h4>
            </Button>
            {doc.shortDescription && (
              <p className="text-muted-foreground mt-0.5 truncate text-sm">
                {doc.shortDescription}
              </p>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {doc.archivedAt && (
              <span className="text-muted-foreground/50 mr-2 flex items-center gap-1 text-xs">
                <Clock className="size-3" />
                Archived {new Date(doc.archivedAt).toLocaleDateString()}
              </span>
            )}
            <Button
              variant="outline"
              onClick={onRestore}
              disabled={isPending}
              className="text-primary border-primary/20 hover:bg-primary/5 h-auto gap-1.5 px-3 py-1.5 text-xs"
            >
              <RotateCcw className="size-3" /> Restore
            </Button>
            {deleteConfirmId === doc.id ? (
              <div className="flex items-center gap-1.5">
                <span className="text-destructive text-xs">Delete forever?</span>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isPending}
                  className="h-auto px-2.5 py-1.5 text-xs"
                >
                  Yes, delete
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancelDelete}
                  className="h-auto px-2.5 py-1.5 text-xs"
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={onConfirmDelete}
                className="text-destructive/70 border-destructive/15 hover:bg-destructive/5 h-auto gap-1.5 border px-3 py-1.5 text-xs"
              >
                <Trash2 className="size-3" /> Delete permanently
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

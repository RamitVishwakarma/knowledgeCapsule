"use client";

import { useAppStore } from "@/store/appStore";
import { Archive, Loader2 } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getArchivedDocuments, restoreDocument, deleteDocument } from "@/app/actions/documents";
import type { Document } from "@/lib/types";
import { handleActionResult } from "@/lib/utils/action-result";
import { ArchivedDocumentCard } from "@/components/archived-document-card";

interface ArchivedListProps {
  onRefresh: () => void;
}

export function ArchivedList({ onRefresh }: ArchivedListProps) {
  const selectDocument = useAppStore((s) => s.selectDocument);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    getArchivedDocuments().then((res) => {
      if (!cancelled && res.status) {
        setDocuments(res.data || []);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRestore = (id: string) => {
    startTransition(async () => {
      const result = await restoreDocument(id);
      handleActionResult(result, () => {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        toast.success("Restored from archive");
        onRefresh();
      });
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteDocument(id);
      handleActionResult(result, () => {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setDeleteConfirmId(null);
        toast.success("Permanently deleted");
        onRefresh();
      });
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-background/95 border-border sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Archive className="text-muted-foreground size-5" />
          <div>
            <h2 className="text-foreground">Archive</h2>
            <p className="text-muted-foreground text-sm">
              {isLoading
                ? "Loading..."
                : `${documents.length} archived recording${documents.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary size-8 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center">
            <div className="bg-secondary mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
              <Archive className="text-muted-foreground/30 size-7" />
            </div>
            <h3 className="text-foreground mb-2">Archive is empty</h3>
            <p className="text-muted-foreground text-sm">
              Recordings you archive will appear here. You can restore them or permanently delete
              them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <ArchivedDocumentCard
                key={doc.id}
                doc={doc}
                deleteConfirmId={deleteConfirmId}
                isPending={isPending}
                onView={() => selectDocument(doc.id)}
                onRestore={() => handleRestore(doc.id)}
                onConfirmDelete={() => setDeleteConfirmId(doc.id)}
                onDelete={() => handleDelete(doc.id)}
                onCancelDelete={() => setDeleteConfirmId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

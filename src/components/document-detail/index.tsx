"use client";

import { useAppStore } from "@/store/appStore";
import { useState, useEffect, useTransition } from "react";
import { Loader2, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/lib/types";
import {
  getDocument,
  updateDocument,
  archiveDocument,
  restoreDocument,
  deleteDocument,
} from "@/app/actions/documents";
import { fetchTranscript, saveManualTranscript } from "@/app/actions/transcript";
import { generateDocumentSummary } from "@/app/actions/summary";
import { useEditField } from "@/utils/hooks/useEditField";
import { extractVideoId } from "@/utils/helpers/youtube";
import { handleActionResult } from "@/lib/utils/action-result";
import { STATUS_CONFIG } from "@/lib/constants/document";
import { DocumentDetailTopBar } from "@/components/document-detail/top-bar";
import { DocumentDetailArchivedBanner } from "@/components/document-detail/archived-banner";
import { DocumentDetailTitleField } from "@/components/document-detail/title-field";
import { DocumentDetailShortDescField } from "@/components/document-detail/short-desc-field";
import { DocumentDetailVideoPreview } from "@/components/document-detail/video-preview";
import { DocumentDetailNotesSection } from "@/components/document-detail/notes-section";
import { DocumentDetailTranscriptSection } from "@/components/document-detail/transcript-section";
import { DocumentDetailSummarySection } from "@/components/document-detail/summary-section";
import { ConfirmModal } from "@/components/document-detail/confirm-modal";

interface DocumentDetailProps {
  onRefresh: () => void;
}

export function DocumentDetail({ onRefresh }: DocumentDetailProps) {
  const selectedDocId = useAppStore((s) => s.selectedDocId);
  const selectDocument = useAppStore((s) => s.selectDocument);
  const [doc, setDoc] = useState<Document | null>(null);
  const [loadedDocId, setLoadedDocId] = useState<string | null>(null);
  const isLoading = !!selectedDocId && selectedDocId !== loadedDocId;

  const [showTranscript, setShowTranscript] = useState(false);
  const titleField = useEditField();
  const shortDescField = useEditField();
  const longDescField = useEditField();
  const transcriptField = useEditField();
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isFetchingTranscript, startFetchingTranscript] = useTransition();

  useEffect(() => {
    if (!selectedDocId) return;
    let cancelled = false;
    getDocument(selectedDocId).then((d) => {
      if (!cancelled) {
        setDoc(d);
        setLoadedDocId(selectedDocId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDocId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  if (!doc) return null;

  const isArchived = doc.archived;
  const ytId = extractVideoId(doc.videoUrl);
  const status = STATUS_CONFIG[doc.summaryStatus];
  const StatusIcon = status.icon;

  const saveField = (updates: Parameters<typeof updateDocument>[1]) => {
    startSaving(async () => {
      const result = await updateDocument(doc.id, updates);
      handleActionResult(result, () => {
        setDoc((prev) => ({ ...prev!, ...updates }));
        toast.success("Saved");
      });
    });
  };

  const handleArchive = () => {
    startSaving(async () => {
      const result = await archiveDocument(doc.id);
      handleActionResult(result, () => {
        selectDocument(null);
        toast.success("Moved to archive");
        onRefresh();
      });
    });
  };

  const handleRestore = () => {
    startSaving(async () => {
      const result = await restoreDocument(doc.id);
      handleActionResult(result, () => {
        setDoc((prev) => ({ ...prev!, archived: false, archivedAt: null }));
        toast.success("Restored from archive");
        onRefresh();
      });
    });
  };

  const handlePermanentDelete = () => {
    startSaving(async () => {
      const result = await deleteDocument(doc.id);
      handleActionResult(result, () => {
        selectDocument(null);
        toast.success("Permanently deleted");
        onRefresh();
      });
    });
  };

  const handleFetchTranscript = () => {
    startFetchingTranscript(async () => {
      toast.info("Fetching transcript...");
      const result = await fetchTranscript(doc.id);
      handleActionResult(result, (r) => {
        setDoc((prev) => ({ ...prev!, transcript: r.transcript, transcriptSource: "youtube" }));
        toast.success("Transcript fetched!");
      });
    });
  };

  const handleSaveTranscript = () => {
    startSaving(async () => {
      const result = await saveManualTranscript(doc.id, transcriptField.draft);
      handleActionResult(result, () => {
        setDoc((prev) => ({
          ...prev!,
          transcript: transcriptField.draft,
          transcriptSource: "manual",
        }));
        transcriptField.cancelEdit();
        toast.success("Transcript saved");
      });
    });
  };

  const handleGenerateSummary = () => {
    startGenerating(async () => {
      setDoc((prev) => ({ ...prev!, summaryStatus: "processing" }));
      const result = await generateDocumentSummary(doc.id);
      if ("error" in result) {
        setDoc((prev) => ({ ...prev!, summaryStatus: "failed" }));
      }
      handleActionResult(result, (r) => {
        setDoc((prev) => ({ ...prev!, summary: r.summary, summaryStatus: "ready" }));
        toast.success("Summary generated!");
      });
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DocumentDetailTopBar
        status={status}
        StatusIcon={StatusIcon}
        summaryStatus={doc.summaryStatus}
        isArchived={isArchived}
        isSaving={isSaving}
        onBack={() => selectDocument(null)}
        onArchive={() => setShowArchiveConfirm(true)}
        onRestore={handleRestore}
        onShowPermanentDelete={() => setShowPermanentDeleteConfirm(true)}
      />

      {isArchived && <DocumentDetailArchivedBanner />}

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-6">
        <DocumentDetailTitleField
          title={doc.title}
          isArchived={isArchived}
          isSaving={isSaving}
          field={titleField}
          onSave={(v) => saveField({ title: v })}
        />
        <DocumentDetailShortDescField
          shortDescription={doc.shortDescription}
          isArchived={isArchived}
          isSaving={isSaving}
          field={shortDescField}
          onSave={(v) => saveField({ shortDescription: v })}
        />
        <DocumentDetailVideoPreview videoUrl={doc.videoUrl} title={doc.title} ytId={ytId} />
        <DocumentDetailNotesSection
          longDescription={doc.longDescription}
          isArchived={isArchived}
          isSaving={isSaving}
          field={longDescField}
          onSave={(v) => saveField({ longDescription: v })}
        />
        <DocumentDetailTranscriptSection
          doc={doc}
          isArchived={isArchived}
          showTranscript={showTranscript}
          onToggleTranscript={() => setShowTranscript((prev) => !prev)}
          field={transcriptField}
          isFetchingTranscript={isFetchingTranscript}
          isSaving={isSaving}
          onFetchTranscript={handleFetchTranscript}
          onSaveTranscript={handleSaveTranscript}
        />
        <DocumentDetailSummarySection
          doc={doc}
          isArchived={isArchived}
          status={status}
          StatusIcon={StatusIcon}
          isGenerating={isGenerating}
          onSaveSummary={(html) => {
            setDoc((prev) => ({ ...prev!, summary: html }));
            saveField({ summary: html });
          }}
          onGenerateSummary={handleGenerateSummary}
        />
      </div>

      <ConfirmModal
        open={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchive}
        icon={<Archive className="size-6 text-amber-600" />}
        iconBgClass="bg-amber-50"
        title="Archive this recording?"
        description={`"${doc.title}" will be moved to your archive. You can restore it anytime.`}
        confirmLabel="Archive"
        isConfirming={isSaving}
      />

      <ConfirmModal
        open={showPermanentDeleteConfirm}
        onClose={() => setShowPermanentDeleteConfirm(false)}
        onConfirm={handlePermanentDelete}
        icon={<Trash2 className="text-destructive size-6" />}
        iconBgClass="bg-red-50"
        title="Permanently delete?"
        description={`"${doc.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete forever"
        confirmVariant="destructive"
        isConfirming={isSaving}
      />
    </div>
  );
}

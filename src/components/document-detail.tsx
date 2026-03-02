"use client";

import { useAppStore } from "@/store/appStore";
import { useState, useEffect, useTransition } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  RefreshCw,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Copy,
  X,
  Play,
  Archive,
  RotateCcw,
  Download,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type React from "react";
import type { Document } from "@/lib/types";
import { getDocument, updateDocument, archiveDocument, restoreDocument, deleteDocument } from "@/app/actions/documents";
import { fetchTranscript, saveManualTranscript } from "@/app/actions/transcript";
import { generateDocumentSummary } from "@/app/actions/summary";
import { TiptapEditor } from "@/components/tiptap-editor";
import { useEditField } from "@/utils/hooks/useEditField";
import { extractVideoId } from "@/utils/helpers/youtube";
import DOMPurify from "dompurify";

interface DocumentDetailProps {
  onRefresh: () => void;
}

export function DocumentDetail({ onRefresh }: DocumentDetailProps) {
  const selectedDocId = useAppStore((s) => s.selectedDocId);
  const selectDocument = useAppStore((s) => s.selectDocument);
  const [doc, setDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    getDocument(selectedDocId).then((d) => {
      if (!cancelled) {
        setDoc(d);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [selectedDocId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!doc) return null;

  const isArchived = doc.archived;
  const ytId = extractVideoId(doc.videoUrl);

  const handleSaveField = (field: string, value: string) => {
    startSaving(async () => {
      const result = await updateDocument(doc.id, { [field]: value } as Parameters<typeof updateDocument>[1]);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) => ({ ...prev!, [field]: value }));
        toast.success("Saved");
      }
    });
  };

  const handleArchive = () => {
    startSaving(async () => {
      const result = await archiveDocument(doc.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        selectDocument(null);
        toast.success("Moved to archive");
        onRefresh();
      }
    });
  };

  const handleRestore = () => {
    startSaving(async () => {
      const result = await restoreDocument(doc.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) => ({ ...prev!, archived: false, archivedAt: null }));
        toast.success("Restored from archive");
        onRefresh();
      }
    });
  };

  const handlePermanentDelete = () => {
    startSaving(async () => {
      const result = await deleteDocument(doc.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        selectDocument(null);
        toast.success("Permanently deleted");
        onRefresh();
      }
    });
  };

  const handleFetchTranscript = () => {
    startFetchingTranscript(async () => {
      toast.info("Fetching transcript...");
      const result = await fetchTranscript(doc.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) => ({ ...prev!, transcript: result.transcript, transcriptSource: "youtube" }));
        toast.success("Transcript fetched!");
      }
    });
  };

  const handleSaveTranscript = () => {
    startSaving(async () => {
      const result = await saveManualTranscript(doc.id, transcriptField.draft);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) => ({ ...prev!, transcript: transcriptField.draft, transcriptSource: "manual" }));
        transcriptField.cancelEdit();
        toast.success("Transcript saved");
      }
    });
  };

  const handleGenerateSummary = () => {
    startGenerating(async () => {
      setDoc((prev) => ({ ...prev!, summaryStatus: "processing" }));
      const result = await generateDocumentSummary(doc.id);
      if ("error" in result) {
        setDoc((prev) => ({ ...prev!, summaryStatus: "failed" }));
        toast.error(result.error);
      } else {
        setDoc((prev) => ({ ...prev!, summary: result.summary, summaryStatus: "ready" }));
        toast.success("Summary generated!");
      }
    });
  };

  const statusConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
    none: { icon: FileText, label: "No summary", className: "bg-gray-100 text-gray-500" },
    processing: { icon: Loader2, label: "Generating summary...", className: "bg-amber-50 text-amber-600" },
    ready: { icon: CheckCircle, label: "Summary ready", className: "bg-green-50 text-green-600" },
    failed: { icon: AlertCircle, label: "Generation failed", className: "bg-red-50 text-red-600" },
  };

  const status = statusConfig[doc.summaryStatus];
  const StatusIcon = status.icon;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-3 border-b border-border flex items-center justify-between">
        <button
          onClick={() => selectDocument(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[14px] transition-colors"
        >
          <ArrowLeft className="size-4" />
          {isArchived ? "Back to archive" : "Back to list"}
        </button>
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${status.className}`}>
            <StatusIcon className={`w-3 h-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`} />
            {status.label}
          </div>

          {isArchived ? (
            <>
              <button
                onClick={handleRestore}
                disabled={isSaving}
                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-1.5 text-[13px] disabled:opacity-50"
              >
                <RotateCcw className="size-4" />
                <span className="hidden sm:inline">Restore</span>
              </button>
              <button
                onClick={() => setShowPermanentDeleteConfirm(true)}
                className="p-2 text-destructive hover:bg-destructive/5 rounded-lg transition-colors flex items-center gap-1.5 text-[13px]"
              >
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
              title="Move to archive"
            >
              <Archive className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Archived banner */}
      {isArchived && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <Archive className="size-4 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] text-amber-800">This recording is archived.</p>
            <p className="text-[12px] text-amber-600">Restore it to move back to its topic, or delete it permanently.</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Title */}
        <div>
          {titleField.isEditing && !isArchived ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={titleField.draft}
                onChange={(e) => titleField.setDraft(e.target.value)}
                className="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg outline-none text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { handleSaveField("title", titleField.draft); titleField.cancelEdit(); }
                  if (e.key === "Escape") titleField.cancelEdit();
                }}
              />
              <button
                onClick={() => { handleSaveField("title", titleField.draft); titleField.cancelEdit(); }}
                disabled={isSaving}
                className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              >
                <Save className="size-4" />
              </button>
              <button onClick={titleField.cancelEdit} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2 group">
              <h1 className={`text-foreground flex-1 ${isArchived ? "opacity-70" : ""}`}>{doc.title}</h1>
              {!isArchived && (
                <button
                  onClick={() => titleField.startEdit(doc.title)}
                  className="p-1.5 text-muted-foreground/0 group-hover:text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit3 className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Short description */}
        <div>
          {shortDescField.isEditing && !isArchived ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={shortDescField.draft}
                onChange={(e) => shortDescField.setDraft(e.target.value)}
                className="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg text-[14px] outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { handleSaveField("shortDescription", shortDescField.draft); shortDescField.cancelEdit(); }
                  if (e.key === "Escape") shortDescField.cancelEdit();
                }}
              />
              <button
                onClick={() => { handleSaveField("shortDescription", shortDescField.draft); shortDescField.cancelEdit(); }}
                disabled={isSaving}
                className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 group ${!isArchived ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (!isArchived) shortDescField.startEdit(doc.shortDescription);
              }}
            >
              <p className="text-muted-foreground text-[14px] flex-1">
                {doc.shortDescription || (isArchived ? "No description" : "Add a short description...")}
              </p>
              {!isArchived && <Edit3 className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground" />}
            </div>
          )}
        </div>

        {/* Video Preview */}
        <div className="rounded-xl overflow-hidden border border-border bg-card">
          {ytId ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={doc.title}
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="size-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-[14px]">Video preview unavailable</p>
              <a href={doc.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-[14px] flex items-center gap-1 hover:underline">
                Open video link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Long description / Notes */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-foreground text-[14px]">Notes for future me</h4>
            {!isArchived && (
              <button
                onClick={() => {
                  if (longDescField.isEditing) {
                    longDescField.cancelEdit();
                  } else {
                    longDescField.startEdit(doc.longDescription);
                  }
                }}
                className="text-muted-foreground hover:text-primary text-[13px] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {longDescField.isEditing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>
          {longDescField.isEditing && !isArchived ? (
            <div>
              <TiptapEditor
                content={longDescField.draft}
                onChange={longDescField.setDraft}
                minHeight="100px"
              />
              <button
                onClick={() => { handleSaveField("longDescription", longDescField.draft); longDescField.cancelEdit(); }}
                disabled={isSaving}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save notes"}
              </button>
            </div>
          ) : (
            doc.longDescription ? (
              <div
                className="prose prose-sm max-w-none text-foreground/80 text-[14px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc.longDescription) }}
              />
            ) : (
              <p className="text-muted-foreground text-[14px]">
                {isArchived ? "No notes." : "No notes yet. Click edit to add context for your future self."}
              </p>
            )
          )}
        </div>

        {/* Transcript */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <h4 className="text-foreground text-[14px]">Transcript</h4>
              <span className={`px-2 py-0.5 rounded text-[11px] ${
                doc.transcriptSource === "youtube" ? "bg-red-50 text-red-600" :
                doc.transcriptSource === "manual" ? "bg-blue-50 text-blue-600" :
                "bg-gray-100 text-gray-500"
              }`}>
                {doc.transcriptSource === "youtube" ? "YouTube" : doc.transcriptSource === "manual" ? "Manual" : "None"}
              </span>
            </div>
            {showTranscript ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </button>

          {showTranscript && (
            <div className="mt-3 pt-3 border-t border-border">
              {!doc.transcript && doc.videoProvider === "youtube" && !isArchived && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-[13px] mb-3">No transcript yet. Try fetching it from YouTube.</p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleFetchTranscript}
                      disabled={isFetchingTranscript}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isFetchingTranscript ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      {isFetchingTranscript ? "Fetching..." : "Fetch from YouTube"}
                    </button>
                    <button
                      onClick={() => transcriptField.startEdit("")}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Paste manually
                    </button>
                  </div>
                </div>
              )}

              {!doc.transcript && doc.videoProvider !== "youtube" && !isArchived && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-[13px] mb-3">No transcript available for this recording.</p>
                  <button
                    onClick={() => transcriptField.startEdit("")}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Paste transcript manually
                  </button>
                </div>
              )}

              {doc.transcript && (
                transcriptField.isEditing && !isArchived ? (
                  <div>
                    <textarea
                      value={transcriptField.draft}
                      onChange={(e) => transcriptField.setDraft(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[13px] outline-none focus:border-primary resize-none font-mono"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveTranscript}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={transcriptField.cancelEdit} className="px-4 py-2 border border-border rounded-lg text-[13px]">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground text-[13px] leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {doc.transcript}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {!isArchived && (
                        <button
                          onClick={() => transcriptField.startEdit(doc.transcript ?? "")}
                          className="text-primary text-[13px] flex items-center gap-1 hover:underline"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit transcript
                        </button>
                      )}
                      <button
                        onClick={() => { navigator.clipboard.writeText(doc.transcript ?? ""); toast.success("Copied!"); }}
                        className="text-muted-foreground text-[13px] flex items-center gap-1 hover:text-foreground"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                  </>
                )
              )}
              <p className="text-[11px] text-muted-foreground/50 mt-3">
                Summaries are generated from available transcripts and are fully editable.
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h4 className="text-foreground">Summary</h4>
              <div className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${status.className}`}>
                <StatusIcon className={`w-3 h-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`} />
                {status.label}
              </div>
            </div>
            {doc.summaryStatus !== "processing" && !isArchived && doc.transcript && (
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="px-3 py-1.5 text-[13px] text-primary border border-primary/20 rounded-lg hover:bg-primary/5 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {isGenerating ? "Generating..." : doc.summary ? "Regenerate" : "Generate"}
              </button>
            )}
          </div>

          {doc.summaryStatus === "processing" ? (
            <div className="py-12 text-center">
              <Loader2 className="size-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-[14px]">Generating summary from transcript...</p>
              <p className="text-muted-foreground/50 text-[12px] mt-1">This usually takes a few seconds</p>
            </div>
          ) : doc.summaryStatus === "failed" ? (
            <div className="py-8 text-center">
              <AlertCircle className="size-8 text-destructive/50 mx-auto mb-3" />
              <p className="text-foreground text-[14px] mb-1">Summary generation failed</p>
              <p className="text-muted-foreground text-[13px] mb-4">The transcript may be too short or the API request failed.</p>
              {!isArchived && doc.transcript && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] flex items-center gap-1.5 mx-auto disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try again
                </button>
              )}
            </div>
          ) : doc.summary ? (
            <TiptapEditor
              content={doc.summary}
              onChange={(html) => {
                setDoc((prev) => ({ ...prev!, summary: html }));
                handleSaveField("summary", html);
              }}
              editable={!isArchived}
              minHeight="200px"
            />
          ) : (
            <div className="py-8 text-center">
              <FileText className="size-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-[14px] mb-1">No summary yet</p>
              <p className="text-muted-foreground/60 text-[13px] mb-4">
                {doc.transcript ? "Generate a summary from the available transcript." : "Add a transcript first to generate a summary."}
              </p>
              {doc.transcript && !isArchived && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate summary
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Archive Confirmation */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowArchiveConfirm(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="size-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Archive className="size-6 text-amber-600" />
            </div>
            <h3 className="text-foreground mb-2">Archive this recording?</h3>
            <p className="text-muted-foreground text-[14px] mb-5">
              &ldquo;{doc.title}&rdquo; will be moved to your archive. You can restore it anytime.
            </p>
            <div className="flex gap-2">
              <button onClick={handleArchive} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] disabled:opacity-50">
                {isSaving ? "Archiving..." : "Archive"}
              </button>
              <button onClick={() => setShowArchiveConfirm(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-[14px]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation */}
      {showPermanentDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPermanentDeleteConfirm(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="size-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="size-6 text-destructive" />
            </div>
            <h3 className="text-foreground mb-2">Permanently delete?</h3>
            <p className="text-muted-foreground text-[14px] mb-5">
              &ldquo;{doc.title}&rdquo; will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={handlePermanentDelete} disabled={isSaving} className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-[14px] disabled:opacity-50">
                {isSaving ? "Deleting..." : "Delete forever"}
              </button>
              <button onClick={() => setShowPermanentDeleteConfirm(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-[14px]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

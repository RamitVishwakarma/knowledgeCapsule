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
} from "lucide-react";
import { toast } from "sonner";
import type React from "react";
import type { Document } from "@/lib/types";
import { getDocument, updateDocument, archiveDocument, restoreDocument, deleteDocument } from "@/app/actions/documents";
import { fetchTranscript, saveManualTranscript } from "@/app/actions/transcript";
import { generateDocumentSummary } from "@/app/actions/summary";
import { TiptapEditor } from "@/components/tiptap-editor";

interface DocumentDetailProps {
  onRefresh: () => void;
}

export function DocumentDetail({ onRefresh }: DocumentDetailProps) {
  const { selectedDocId, selectDocument } = useAppStore();
  const [doc, setDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showTranscript, setShowTranscript] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingShortDesc, setEditingShortDesc] = useState(false);
  const [editingLongDesc, setEditingLongDesc] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  const [titleDraft, setTitleDraft] = useState("");
  const [shortDescDraft, setShortDescDraft] = useState("");
  const [longDescDraft, setLongDescDraft] = useState("");
  const [transcriptDraft, setTranscriptDraft] = useState("");

  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isFetchingTranscript, startFetchingTranscript] = useTransition();

  useEffect(() => {
    if (!selectedDocId) return;
    setIsLoading(true);
    getDocument(selectedDocId).then((d) => {
      setDoc(d);
      setIsLoading(false);
    });
  }, [selectedDocId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!doc) return null;

  const isArchived = doc.archived;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  };

  const ytId = getYouTubeId(doc.videoUrl);

  const handleSaveField = (field: string, value: string) => {
    startSaving(async () => {
      const result = await updateDocument(doc.id, { [field]: value } as Parameters<typeof updateDocument>[1]);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) => prev ? { ...prev, [field]: value } : prev);
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
        setDoc((prev) => prev ? { ...prev, archived: false, archivedAt: null } : prev);
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
        setDoc((prev) =>
          prev ? { ...prev, transcript: result.transcript, transcriptSource: "youtube" } : prev
        );
        toast.success("Transcript fetched!");
      }
    });
  };

  const handleSaveTranscript = () => {
    startSaving(async () => {
      const result = await saveManualTranscript(doc.id, transcriptDraft);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDoc((prev) =>
          prev ? { ...prev, transcript: transcriptDraft, transcriptSource: "manual" } : prev
        );
        setEditingTranscript(false);
        toast.success("Transcript saved");
      }
    });
  };

  const handleGenerateSummary = () => {
    startGenerating(async () => {
      setDoc((prev) => prev ? { ...prev, summaryStatus: "processing" } : prev);
      const result = await generateDocumentSummary(doc.id);
      if ("error" in result) {
        setDoc((prev) => prev ? { ...prev, summaryStatus: "failed" } : prev);
        toast.error(result.error);
      } else {
        setDoc((prev) =>
          prev ? { ...prev, summary: result.summary, summaryStatus: "ready" } : prev
        );
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
          <ArrowLeft className="w-4 h-4" />
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
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Restore</span>
              </button>
              <button
                onClick={() => setShowPermanentDeleteConfirm(true)}
                className="p-2 text-destructive hover:bg-destructive/5 rounded-lg transition-colors flex items-center gap-1.5 text-[13px]"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
              title="Move to archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Archived banner */}
      {isArchived && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <Archive className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] text-amber-800">This recording is archived.</p>
            <p className="text-[12px] text-amber-600">Restore it to move back to its topic, or delete it permanently.</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Title */}
        <div>
          {editingTitle && !isArchived ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg outline-none text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { handleSaveField("title", titleDraft); setEditingTitle(false); }
                  if (e.key === "Escape") setEditingTitle(false);
                }}
              />
              <button
                onClick={() => { handleSaveField("title", titleDraft); setEditingTitle(false); }}
                disabled={isSaving}
                className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingTitle(false)} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2 group">
              <h1 className={`text-foreground flex-1 ${isArchived ? "opacity-70" : ""}`}>{doc.title}</h1>
              {!isArchived && (
                <button
                  onClick={() => { setTitleDraft(doc.title); setEditingTitle(true); }}
                  className="p-1.5 text-muted-foreground/0 group-hover:text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Short description */}
        <div>
          {editingShortDesc && !isArchived ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={shortDescDraft}
                onChange={(e) => setShortDescDraft(e.target.value)}
                className="flex-1 px-3 py-2 bg-input-background border border-primary/30 rounded-lg text-[14px] outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { handleSaveField("shortDescription", shortDescDraft); setEditingShortDesc(false); }
                  if (e.key === "Escape") setEditingShortDesc(false);
                }}
              />
              <button
                onClick={() => { handleSaveField("shortDescription", shortDescDraft); setEditingShortDesc(false); }}
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
                if (!isArchived) { setShortDescDraft(doc.shortDescription); setEditingShortDesc(true); }
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
                <Play className="w-8 h-8 text-primary" />
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
                onClick={() => { setLongDescDraft(doc.longDescription); setEditingLongDesc(!editingLongDesc); }}
                className="text-muted-foreground hover:text-primary text-[13px] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editingLongDesc ? "Cancel" : "Edit"}
              </button>
            )}
          </div>
          {editingLongDesc && !isArchived ? (
            <div>
              <TiptapEditor
                content={longDescDraft}
                onChange={setLongDescDraft}
                minHeight="100px"
              />
              <button
                onClick={() => { handleSaveField("longDescription", longDescDraft); setEditingLongDesc(false); }}
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
                dangerouslySetInnerHTML={{ __html: doc.longDescription }}
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
            {showTranscript ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {showTranscript && (
            <div className="mt-3 pt-3 border-t border-border">
              {/* Fetch transcript button for YouTube videos without transcript */}
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
                      onClick={() => { setTranscriptDraft(""); setEditingTranscript(true); }}
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
                    onClick={() => { setTranscriptDraft(""); setEditingTranscript(true); }}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Paste transcript manually
                  </button>
                </div>
              )}

              {doc.transcript && (
                editingTranscript && !isArchived ? (
                  <div>
                    <textarea
                      value={transcriptDraft}
                      onChange={(e) => setTranscriptDraft(e.target.value)}
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
                      <button onClick={() => setEditingTranscript(false)} className="px-4 py-2 border border-border rounded-lg text-[13px]">
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
                          onClick={() => { setTranscriptDraft(doc.transcript ?? ""); setEditingTranscript(true); }}
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
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-[14px]">Generating summary from transcript...</p>
              <p className="text-muted-foreground/50 text-[12px] mt-1">This usually takes a few seconds</p>
            </div>
          ) : doc.summaryStatus === "failed" ? (
            <div className="py-8 text-center">
              <AlertCircle className="w-8 h-8 text-destructive/50 mx-auto mb-3" />
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
                setDoc((prev) => prev ? { ...prev, summary: html } : prev);
                handleSaveField("summary", html);
              }}
              editable={!isArchived}
              minHeight="200px"
            />
          ) : (
            <div className="py-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
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
                  <SparklesIcon className="w-3.5 h-3.5" /> Generate summary
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
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Archive className="w-6 h-6 text-amber-600" />
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
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
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

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

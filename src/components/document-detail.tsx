"use client";

import { useAppStore } from "@/store/appStore";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import type React from "react";

export function DocumentDetail() {
  const {
    documents,
    selectedDocId,
    selectDocument,
    updateDocument,
    archiveDocument,
    restoreDocument,
    permanentlyDeleteDocument,
    regenerateSummary,
  } = useAppStore();
  const doc = documents.find((d) => d.id === selectedDocId);

  const [showTranscript, setShowTranscript] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingShortDesc, setEditingShortDesc] = useState(false);
  const [editingLongDesc, setEditingLongDesc] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  const [titleDraft, setTitleDraft] = useState("");
  const [shortDescDraft, setShortDescDraft] = useState("");
  const [longDescDraft, setLongDescDraft] = useState("");
  const [summaryDraft, setSummaryDraft] = useState("");
  const [transcriptDraft, setTranscriptDraft] = useState("");

  if (!doc) return null;

  const isArchived = doc.archived;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  };

  const ytId = getYouTubeId(doc.videoUrl);

  const handleSave = (field: string, value: string) => {
    updateDocument(doc.id, { [field]: value });
    toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} saved`);
  };

  const handleArchive = () => {
    archiveDocument(doc.id);
    selectDocument(null);
    toast.success("Moved to archive");
  };

  const handleRestore = () => {
    restoreDocument(doc.id);
    toast.success("Restored from archive");
  };

  const handlePermanentDelete = () => {
    permanentlyDeleteDocument(doc.id);
    selectDocument(null);
    toast.success("Permanently deleted");
  };

  const statusConfig: Record<
    string,
    { icon: React.ElementType; label: string; className: string }
  > = {
    none: { icon: FileText, label: "No summary", className: "bg-gray-100 text-gray-500" },
    processing: {
      icon: Loader2,
      label: "Generating summary...",
      className: "bg-amber-50 text-amber-600",
    },
    ready: {
      icon: CheckCircle,
      label: "Summary ready",
      className: "bg-green-50 text-green-600",
    },
    failed: {
      icon: AlertCircle,
      label: "Generation failed",
      className: "bg-red-50 text-red-600",
    },
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
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${status.className}`}
          >
            <StatusIcon
              className={`w-3 h-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`}
            />
            {status.label}
          </div>

          {isArchived ? (
            <>
              <button
                onClick={handleRestore}
                className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-1.5 text-[13px]"
                title="Restore from archive"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Restore</span>
              </button>
              <button
                onClick={() => setShowPermanentDeleteConfirm(true)}
                className="p-2 text-destructive hover:bg-destructive/5 rounded-lg transition-colors flex items-center gap-1.5 text-[13px]"
                title="Delete permanently"
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
            <p className="text-[12px] text-amber-600">
              Restore it to move back to its topic, or delete it permanently.
            </p>
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
                  if (e.key === "Enter") {
                    handleSave("title", titleDraft);
                    setEditingTitle(false);
                  }
                  if (e.key === "Escape") setEditingTitle(false);
                }}
              />
              <button
                onClick={() => {
                  handleSave("title", titleDraft);
                  setEditingTitle(false);
                }}
                className="p-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingTitle(false)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2 group">
              <h1 className={`text-foreground flex-1 ${isArchived ? "opacity-70" : ""}`}>
                {doc.title}
              </h1>
              {!isArchived && (
                <button
                  onClick={() => {
                    setTitleDraft(doc.title);
                    setEditingTitle(true);
                  }}
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
                  if (e.key === "Enter") {
                    handleSave("shortDescription", shortDescDraft);
                    setEditingShortDesc(false);
                  }
                  if (e.key === "Escape") setEditingShortDesc(false);
                }}
              />
              <button
                onClick={() => {
                  handleSave("shortDescription", shortDescDraft);
                  setEditingShortDesc(false);
                }}
                className="p-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 group ${!isArchived ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (!isArchived) {
                  setShortDescDraft(doc.shortDescription);
                  setEditingShortDesc(true);
                }
              }}
            >
              <p className="text-muted-foreground text-[14px] flex-1">
                {doc.shortDescription ||
                  (isArchived ? "No description" : "Add a short description...")}
              </p>
              {!isArchived && (
                <Edit3 className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground" />
              )}
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
              <a
                href={doc.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[14px] flex items-center gap-1 hover:underline"
              >
                Open video link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Long description / Notes */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-foreground text-[14px]">Notes for future me</h4>
            {!isArchived && (
              <button
                onClick={() => {
                  setLongDescDraft(doc.longDescription);
                  setEditingLongDesc(!editingLongDesc);
                }}
                className="text-muted-foreground hover:text-primary text-[13px] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editingLongDesc ? "Cancel" : "Edit"}
              </button>
            )}
          </div>
          {editingLongDesc && !isArchived ? (
            <div>
              <textarea
                value={longDescDraft}
                onChange={(e) => setLongDescDraft(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary resize-none"
              />
              <button
                onClick={() => {
                  handleSave("longDescription", longDescDraft);
                  setEditingLongDesc(false);
                }}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px]"
              >
                Save notes
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground text-[14px] leading-relaxed">
              {doc.longDescription ||
                (isArchived
                  ? "No notes."
                  : "No notes yet. Click edit to add context for your future self.")}
            </p>
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
              <span
                className={`px-2 py-0.5 rounded text-[11px] ${
                  doc.transcriptSource === "youtube"
                    ? "bg-red-50 text-red-600"
                    : doc.transcriptSource === "manual"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {doc.transcriptSource === "youtube"
                  ? "YouTube"
                  : doc.transcriptSource === "manual"
                    ? "Manual"
                    : "None"}
              </span>
            </div>
            {showTranscript ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showTranscript && (
            <div className="mt-3 pt-3 border-t border-border">
              {doc.transcript ? (
                <>
                  {editingTranscript && !isArchived ? (
                    <div>
                      <textarea
                        value={transcriptDraft}
                        onChange={(e) => setTranscriptDraft(e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[13px] outline-none focus:border-primary resize-none font-mono"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            updateDocument(doc.id, {
                              transcript: transcriptDraft,
                              transcriptSource: "manual",
                            });
                            setEditingTranscript(false);
                            toast.success("Transcript saved");
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTranscript(false)}
                          className="px-4 py-2 border border-border rounded-lg text-[13px]"
                        >
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
                            onClick={() => {
                              setTranscriptDraft(doc.transcript);
                              setEditingTranscript(true);
                            }}
                            className="text-primary text-[13px] flex items-center gap-1 hover:underline"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit transcript
                          </button>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(doc.transcript);
                            toast.success("Copied!");
                          }}
                          className="text-muted-foreground text-[13px] flex items-center gap-1 hover:text-foreground"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-[13px] mb-3">
                    No transcript available for this recording.
                  </p>
                  {!isArchived && (
                    <button
                      onClick={() => {
                        setTranscriptDraft("");
                        setEditingTranscript(true);
                      }}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Paste transcript manually
                    </button>
                  )}
                </div>
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
              <div
                className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${status.className}`}
              >
                <StatusIcon
                  className={`w-3 h-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`}
                />
                {status.label}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.summaryStatus !== "processing" && !isArchived && (
                <button
                  onClick={() => regenerateSummary(doc.id)}
                  className="px-3 py-1.5 text-[13px] text-primary border border-primary/20 rounded-lg hover:bg-primary/5 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              )}
              {doc.summary && !editingSummary && doc.summaryStatus === "ready" && !isArchived && (
                <button
                  onClick={() => {
                    setSummaryDraft(doc.summary);
                    setEditingSummary(true);
                  }}
                  className="px-3 py-1.5 text-[13px] text-muted-foreground border border-border rounded-lg hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          </div>

          {doc.summaryStatus === "processing" ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-[14px]">
                Generating summary from transcript...
              </p>
              <p className="text-muted-foreground/50 text-[12px] mt-1">
                This usually takes a few seconds
              </p>
            </div>
          ) : doc.summaryStatus === "failed" ? (
            <div className="py-8 text-center">
              <AlertCircle className="w-8 h-8 text-destructive/50 mx-auto mb-3" />
              <p className="text-foreground text-[14px] mb-1">Summary generation failed</p>
              <p className="text-muted-foreground text-[13px] mb-4">
                The transcript may be too short or unavailable.
              </p>
              {!isArchived && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => regenerateSummary(doc.id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Try again
                  </button>
                  <button
                    onClick={() => {
                      setTranscriptDraft("");
                      setEditingTranscript(true);
                      setShowTranscript(true);
                    }}
                    className="px-4 py-2 border border-border rounded-lg text-[13px] flex items-center gap-1.5"
                  >
                    Paste transcript
                  </button>
                </div>
              )}
            </div>
          ) : doc.summary ? (
            editingSummary && !isArchived ? (
              <div>
                <textarea
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary resize-none font-mono leading-relaxed"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      handleSave("summary", summaryDraft);
                      setEditingSummary(false);
                    }}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save summary
                  </button>
                  <button
                    onClick={() => setEditingSummary(false)}
                    className="px-5 py-2.5 border border-border rounded-lg text-[13px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground/90 text-[14px] leading-relaxed whitespace-pre-wrap">
                {doc.summary}
              </div>
            )
          ) : (
            <div className="py-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-[14px] mb-1">No summary yet</p>
              <p className="text-muted-foreground/60 text-[13px] mb-4">
                {doc.transcript
                  ? "Generate a summary from the available transcript."
                  : "Add a transcript first to generate a summary."}
              </p>
              {doc.transcript && !isArchived && (
                <button
                  onClick={() => regenerateSummary(doc.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] inline-flex items-center gap-1.5"
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
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowArchiveConfirm(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Archive className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-foreground mb-2">Archive this recording?</h3>
            <p className="text-muted-foreground text-[14px] mb-5">
              &ldquo;{doc.title}&rdquo; will be moved to your archive. You can restore it anytime,
              or permanently delete it from there.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleArchive}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px]"
              >
                Archive
              </button>
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-[14px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation */}
      {showPermanentDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPermanentDeleteConfirm(false)}
        >
          <div
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-foreground mb-2">Permanently delete?</h3>
            <p className="text-muted-foreground text-[14px] mb-5">
              &ldquo;{doc.title}&rdquo; will be permanently deleted. This action cannot be undone
              — the recording, transcript, summary, and all notes will be gone forever.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePermanentDelete}
                className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-[14px]"
              >
                Delete forever
              </button>
              <button
                onClick={() => setShowPermanentDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-[14px]"
              >
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

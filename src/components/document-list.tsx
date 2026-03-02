"use client";

import { useAppStore } from "@/store/appStore";
import {
  Plus,
  Play,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Archive,
  RotateCcw,
  Trash2,
  Clock,
} from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getDocuments, createDocument, getArchivedDocuments, restoreDocument, deleteDocument } from "@/app/actions/documents";
import type { Document } from "@/lib/types";

interface DocumentListProps {
  onRefresh: () => void;
}

export function DocumentList({ onRefresh }: DocumentListProps) {
  const { selectedTopicId, viewMode, selectDocument, setSidebarOpen } = useAppStore();

  if (viewMode === "archived") {
    return <ArchivedList onRefresh={onRefresh} />;
  }

  return <ActiveList selectedTopicId={selectedTopicId} onRefresh={onRefresh} onSelectDocument={selectDocument} onOpenSidebar={() => setSidebarOpen(true)} />;
}

function ActiveList({
  selectedTopicId,
  onRefresh,
  onSelectDocument,
  onOpenSidebar,
}: {
  selectedTopicId: string | null;
  onRefresh: () => void;
  onSelectDocument: (id: string | null) => void;
  onOpenSidebar: () => void;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    videoUrl: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedTopicId) {
      setDocuments([]);
      return;
    }
    setIsLoading(true);
    getDocuments(selectedTopicId).then((docs) => {
      setDocuments(docs);
      setIsLoading(false);
    });
  }, [selectedTopicId]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formData.videoUrl.trim()) {
      setFormError("Video URL is required");
      return;
    }
    if (
      !formData.videoUrl.includes("youtube.com") &&
      !formData.videoUrl.includes("youtu.be") &&
      !formData.videoUrl.startsWith("http")
    ) {
      setFormError("Please enter a valid URL (YouTube links recommended)");
      return;
    }

    startTransition(async () => {
      const result = await createDocument({ ...formData, topicId: selectedTopicId! });
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDocuments((prev) => [result.document, ...prev]);
        onSelectDocument(result.document.id);
        setFormData({ title: "", shortDescription: "", longDescription: "", videoUrl: "" });
        setShowAddForm(false);
        setFormError("");
        onRefresh(); // refresh sidebar counts
      }
    });
  };

  if (!selectedTopicId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-foreground mb-2">Select a topic</h3>
          <p className="text-muted-foreground text-[14px] mb-4">
            Choose a topic from the sidebar to view your recordings, or create a new one to get
            started.
          </p>
          <button
            onClick={onOpenSidebar}
            className="md:hidden px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[14px]"
          >
            Open sidebar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground">Recordings</h2>
            <p className="text-muted-foreground text-[13px]">
              {isLoading ? "Loading..." : `${documents.length} recording${documents.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[14px] flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add recording
          </button>
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <div className="mb-6 p-5 rounded-xl border border-primary/20 bg-card shadow-lg">
            <h3 className="text-foreground mb-4">Add new recording</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[13px] text-muted-foreground block mb-1">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Me explaining Binary Search Trees"
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-[13px] text-muted-foreground block mb-1">Short description</label>
                <input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="What did you cover in this recording?"
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-[13px] text-muted-foreground block mb-1">Notes for future you</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, longDescription: e.target.value }))}
                  placeholder="Any context or timestamps your future self should know about..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-[13px] text-muted-foreground block mb-1">
                  YouTube URL * (unlisted recommended)
                </label>
                <input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-[14px] outline-none focus:border-primary transition-colors"
                />
              </div>
              {formError && (
                <p className="text-destructive text-[13px] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formError}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save recording"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError("");
                  }}
                  className="px-5 py-2.5 border border-border text-foreground rounded-lg text-[14px] hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : documents.length === 0 && !showAddForm ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-primary/40" />
            </div>
            <h3 className="text-foreground mb-2">No recordings yet</h3>
            <p className="text-muted-foreground text-[14px] mb-4">
              Record yourself explaining what you learned, upload to YouTube as unlisted, and save the link here.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add first recording
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onClick={() => onSelectDocument(doc.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArchivedList({ onRefresh }: { onRefresh: () => void }) {
  const { selectDocument } = useAppStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getArchivedDocuments().then((docs) => {
      setDocuments(docs);
      setIsLoading(false);
    });
  }, []);

  const handleRestore = (id: string) => {
    startTransition(async () => {
      const result = await restoreDocument(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        toast.success("Restored from archive");
        onRefresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteDocument(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setDeleteConfirmId(null);
        toast.success("Permanently deleted");
        onRefresh();
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Archive className="w-5 h-5 text-muted-foreground" />
          <div>
            <h2 className="text-foreground">Archive</h2>
            <p className="text-muted-foreground text-[13px]">
              {isLoading ? "Loading..." : `${documents.length} archived recording${documents.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Archive className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <h3 className="text-foreground mb-2">Archive is empty</h3>
            <p className="text-muted-foreground text-[14px]">
              Recordings you archive will appear here. You can restore them or permanently delete them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() => selectDocument(doc.id)}
                          className="text-foreground hover:text-primary transition-colors text-left"
                        >
                          <h4 className="truncate">{doc.title}</h4>
                        </button>
                        {doc.shortDescription && (
                          <p className="text-muted-foreground text-[13px] truncate mt-0.5">
                            {doc.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {doc.archivedAt && (
                        <span className="text-[11px] text-muted-foreground/50 flex items-center gap-1 mr-2">
                          <Clock className="w-3 h-3" />
                          Archived {new Date(doc.archivedAt).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleRestore(doc.id)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-[12px] text-primary border border-primary/20 rounded-lg hover:bg-primary/5 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                      {deleteConfirmId === doc.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-destructive">Delete forever?</span>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={isPending}
                            className="px-2.5 py-1.5 text-[12px] bg-destructive text-destructive-foreground rounded-lg disabled:opacity-50"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1.5 text-[12px] border border-border rounded-lg"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(doc.id)}
                          className="px-3 py-1.5 text-[12px] text-destructive/70 border border-destructive/15 rounded-lg hover:bg-destructive/5 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete permanently
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ doc, onClick }: { doc: Document; onClick: () => void }) {
  const statusConfig = {
    none: { icon: FileText, label: "No summary", className: "bg-gray-100 text-gray-500" },
    processing: { icon: Loader2, label: "Processing...", className: "bg-amber-50 text-amber-600" },
    ready: { icon: CheckCircle, label: "Summary ready", className: "bg-green-50 text-green-600" },
    failed: { icon: AlertCircle, label: "Failed", className: "bg-red-50 text-red-600" },
  };

  const status = statusConfig[doc.summaryStatus];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
          <Play className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-foreground truncate">{doc.title}</h4>
              {doc.shortDescription && (
                <p className="text-muted-foreground text-[13px] truncate mt-0.5">
                  {doc.shortDescription}
                </p>
              )}
            </div>
            <div className={`px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 shrink-0 ${status.className}`}>
              <StatusIcon className={`w-3 h-3 ${doc.summaryStatus === "processing" ? "animate-spin" : ""}`} />
              {status.label}
            </div>
          </div>
          {doc.summary && (
            <p className="text-muted-foreground text-[12px] mt-2 line-clamp-2 leading-relaxed">
              {doc.summary.replace(/<[^>]*>/g, "").replace(/[#*]/g, "").substring(0, 150)}...
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground/60">
            <span>Recorded {new Date(doc.createdAt).toLocaleDateString()}</span>
            {doc.transcriptSource && (
              <span>Transcript: {doc.transcriptSource}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

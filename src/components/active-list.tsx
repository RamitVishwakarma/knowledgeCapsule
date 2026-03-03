"use client";

import { FolderOpen, Plus, Loader2, FileText } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { getDocuments, createDocument } from "@/app/actions/documents";
import type { Document } from "@/lib/types";
import { DocumentCard } from "@/components/document-card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/forms/form-input";
import FormTextArea from "@/components/common/forms/formTextarea";
import { handleActionResult } from "@/lib/utils/action-result";

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  videoUrl: z
    .string()
    .min(1, "Video URL is required")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be") || url.startsWith("http"),
      "Please enter a valid URL (YouTube links recommended)"
    ),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface ActiveListProps {
  selectedTopicId: string | null;
  onRefresh: () => void;
  onSelectDocument: (id: string | null) => void;
  onOpenSidebar: () => void;
}

export function ActiveList({
  selectedTopicId,
  onRefresh,
  onSelectDocument,
  onOpenSidebar,
}: ActiveListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadedTopicId, setLoadedTopicId] = useState<string | null>(null);
  const isLoading = !!selectedTopicId && selectedTopicId !== loadedTopicId;
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      videoUrl: "",
    },
  });

  useEffect(() => {
    if (!selectedTopicId) return;
    let cancelled = false;
    getDocuments(selectedTopicId).then((docs) => {
      if (!cancelled) {
        setDocuments(docs);
        setLoadedTopicId(selectedTopicId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedTopicId]);

  const onSubmit = (data: DocumentFormValues) => {
    startTransition(async () => {
      const result = await createDocument({
        ...data,
        shortDescription: data.shortDescription || "",
        longDescription: data.longDescription || "",
        topicId: selectedTopicId!,
      });
      handleActionResult(result, (r) => {
        setDocuments((prev) => [r.document, ...prev]);
        onSelectDocument(r.document.id);
        form.reset();
        setShowAddForm(false);
        onRefresh();
      });
    });
  };

  if (!selectedTopicId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <div className="bg-secondary mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl">
            <FolderOpen className="text-primary/40 size-8" />
          </div>
          <h3 className="text-foreground mb-2">Select a topic</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Choose a topic from the sidebar to view your recordings, or create a new one to get
            started.
          </p>
          <Button onClick={onOpenSidebar} className="text-sm md:hidden">
            Open sidebar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-background/95 border-border sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground">Recordings</h2>
            <p className="text-muted-foreground text-sm">
              {isLoading
                ? "Loading..."
                : `${documents.length} recording${documents.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-sm">
            <Plus className="size-4" />
            Add recording
          </Button>
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <div className="border-primary/20 bg-card mb-6 rounded-xl border p-5 shadow-lg">
            <h3 className="text-foreground mb-4">Add new recording</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  name="title"
                  label="Title *"
                  placeholder="e.g., Me explaining Binary Search Trees"
                />
                <FormInput
                  name="shortDescription"
                  label="Short description"
                  placeholder="What did you cover in this recording?"
                />
                <FormTextArea
                  name="longDescription"
                  label="Notes for future you"
                  placeholder="Any context or timestamps your future self should know about..."
                />
                <FormInput
                  name="videoUrl"
                  label="YouTube URL * (unlisted recommended)"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="px-5 text-sm">
                    {isSubmitting ? "Saving..." : "Save recording"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      form.reset();
                    }}
                    className="px-5 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary size-8 animate-spin" />
          </div>
        ) : documents.length === 0 && !showAddForm ? (
          <div className="py-16 text-center">
            <div className="bg-secondary mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
              <FileText className="text-primary/40 size-7" />
            </div>
            <h3 className="text-foreground mb-2">No recordings yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Record yourself explaining what you learned, upload to YouTube as unlisted, and save
              the link here.
            </p>
            <Button onClick={() => setShowAddForm(true)} className="gap-2 text-sm">
              <Plus className="size-4" />
              Add first recording
            </Button>
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

"use client";

import { useRef } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useYouTubeUpload } from "@/utils/hooks/useYouTubeUpload";

interface VideoUploadTabProps {
  title: string;
  onUploadComplete: (videoUrl: string) => void;
}

export function VideoUploadTab({ title, onUploadComplete }: VideoUploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, isUploading, error, reset } = useYouTubeUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file, title || file.name);
    if (result) {
      onUploadComplete(result.videoUrl);
    }
  };

  if (isUploading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Uploading to YouTube... {progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Do not close this window until the upload is complete.
        </p>
      </div>
    );
  }

  if (progress === 100) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="size-4" />
        <span>Uploaded! YouTube URL has been filled in.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
          <button
            type="button"
            onClick={reset}
            className="ml-2 underline"
          >
            Try again
          </button>
        </p>
      )}
      <div
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-8 text-primary/40" />
        <div>
          <p className="text-sm font-medium text-foreground">Click to select a video</p>
          <p className="text-xs text-muted-foreground">
            Will be uploaded to your YouTube channel as unlisted
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" className="text-xs">
          Choose file
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

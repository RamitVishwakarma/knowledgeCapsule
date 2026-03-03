"use client";

import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DocumentDetailVideoPreviewProps {
  videoUrl: string;
  title: string;
  ytId: string | null;
}

export function DocumentDetailVideoPreview({
  videoUrl,
  title,
  ytId,
}: DocumentDetailVideoPreviewProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      {ytId ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      ) : (
        <div className="bg-muted flex aspect-video flex-col items-center justify-center gap-3">
          <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
            <Play className="text-primary size-8" />
          </div>
          <p className="text-muted-foreground text-sm">Video preview unavailable</p>
          <Link
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 text-sm hover:underline"
          >
            Open video link <ExternalLink className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

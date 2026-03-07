"use client";

import { useState, useCallback } from "react";

interface UploadResult {
  videoId: string;
  videoUrl: string;
}

interface UseYouTubeUploadReturn {
  upload: (file: File, title: string) => Promise<UploadResult | null>;
  progress: number;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

export function useYouTubeUpload(): UseYouTubeUploadReturn {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File, title: string): Promise<UploadResult | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      return new Promise((resolve) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText) as UploadResult;
            setProgress(100);
            resolve(data);
          } else {
            let message = "Upload failed";
            try {
              const data = JSON.parse(xhr.responseText) as { error?: string };
              if (data.error) message = data.error;
            } catch {
              // ignore parse errors
            }
            setError(message);
            resolve(null);
          }
        });

        xhr.addEventListener("error", () => {
          setIsUploading(false);
          setError("Network error during upload");
          resolve(null);
        });

        xhr.open("POST", "/api/youtube-upload");
        xhr.send(formData);
      });
    },
    [],
  );

  return { upload, progress, isUploading, error, reset };
}

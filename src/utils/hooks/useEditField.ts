"use client";

import { useState } from "react";

export interface UseEditFieldReturn {
  isEditing: boolean;
  draft: string;
  startEdit: (currentValue: string) => void;
  cancelEdit: () => void;
  setDraft: (value: string) => void;
}

export function useEditField(initialValue = ""): UseEditFieldReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);

  return {
    isEditing,
    draft,
    startEdit: (currentValue: string) => {
      setDraft(currentValue);
      setIsEditing(true);
    },
    cancelEdit: () => setIsEditing(false),
    setDraft,
  };
}

"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: ReactNode;
  iconBgClass: string;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "default" | "destructive";
  isConfirming: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  icon,
  iconBgClass,
  title,
  description,
  confirmLabel,
  confirmVariant = "default",
  isConfirming,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${iconBgClass}`}>
          {icon}
        </div>
        <h3 className="text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-5 text-sm">{description}</p>
        <div className="flex gap-2">
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex-1 text-sm"
          >
            {isConfirming ? "Please wait..." : confirmLabel}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 text-sm">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

import { Button } from "@/components/ui/button";

import { Loader } from "@/components/ui/loader";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: React.ReactNode;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  variant?: ButtonVariant;
  children?: React.ReactNode;
  btnSize?: ButtonSize;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action? This action cannot be undone.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  loading = false,
  variant = "default",
  btnSize = "sm",
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="max-w-md overflow-hidden bg-white p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Accessible title/description for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{typeof title === "string" ? title : "Confirm Action"}</DialogTitle>
          <DialogDescription>{description || "Please confirm this action."}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 pt-7 pb-6">
          <p className="text-2xl leading-9 font-semibold text-neutral-900">{title}</p>
          {description && description !== "" && (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          )}
          {children}
        </div>

        {/* Footer */}
        <div className="shadow-footer bg-background flex h-13 items-center justify-end gap-2 px-5">
          <Button variant="secondary" size={btnSize} onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button variant={variant} size={btnSize} onClick={onConfirm} disabled={loading}>
            {confirmButtonText}
            {loading && <Loader className="size-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
ActionDialog.displayName = "ActionDialog";

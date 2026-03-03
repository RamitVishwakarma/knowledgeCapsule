"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { cn } from "@/components/ui/utils";

import { Loader } from "@/components/ui/loader";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface Props {
  children?: React.ReactNode;
  modal?: boolean;
  defaultOpen?: boolean;
  open: boolean;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  headerVisible?: boolean;
  footerVisible?: boolean;
  onClose: () => void;
  showDividers?: boolean;
  className?: string;
  headerClassName?: string;
  headerTitleClassName?: string;
  footerClassName?: string;
  cancelBtnName?: string;
  submitBtnName?: string;
  btnClassName?: string;
  onSubmit?: () => void;
  btnSize?: ButtonSize;
  cancelBtnVariant?: ButtonVariant;
  submitBtnVariant?: ButtonVariant;
  hideCancelButton?: boolean;
  hideSubmitButton?: boolean;
  loading?: boolean;
  disableSubmit?: boolean;
  hideCloseIcon?: boolean;
  closeIconClassName?: string;
  preventOutsideClick?: boolean;
  onClear?: () => void;
}

const DialogBox: React.FC<Props> = ({
  children,
  modal = true,
  defaultOpen,
  open,
  onClose,
  title,
  description,
  headerVisible = true,
  footerVisible = true,
  className = "",
  headerClassName = "",
  headerTitleClassName = "",
  footerClassName = "",
  btnClassName = "",
  cancelBtnName = "CANCEL",
  submitBtnName = "SUBMIT",
  onSubmit,
  btnSize = "sm",
  cancelBtnVariant = "secondary",
  submitBtnVariant = "default",
  hideCancelButton,
  hideSubmitButton,
  loading = false,
  disableSubmit = false,
  preventOutsideClick = false,
  onClear,
}) => {
  const [dialogOpen, setDialogOpen] = useState(open);

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  const closeHandler = () => {
    onClose();
    setDialogOpen(false);
  };

  return (
    <Dialog modal={modal} open={dialogOpen} onOpenChange={closeHandler} defaultOpen={defaultOpen}>
      <DialogContent
        className={cn(className, "flex flex-col overflow-hidden bg-neutral-100 p-0")}
        onPointerDownOutside={preventOutsideClick ? (e) => e.preventDefault() : undefined}
      >
        {headerVisible ? (
          <DialogHeader
            className={cn(headerClassName, "flex border-b border-neutral-300 px-8 py-6")}
          >
            <div className="flex w-full items-center justify-between">
              <DialogTitle className={headerTitleClassName}>{title}</DialogTitle>

              <div className="flex items-center gap-2">
                {onClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-destructive text-base"
                  >
                    Clear all filters{" "}
                  </Button>
                )}
                <DialogClose className={cn("size-4")}>
                  <XIcon className="size-3" />
                </DialogClose>
              </div>
            </div>
          </DialogHeader>
        ) : (
          <DialogHeader className={`sr-only ${headerClassName}`}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}
        <div className="flex h-full flex-col justify-between px-8 py-2 pb-6">
          <div className="max-h-[70vh] overflow-auto">{children}</div>
          {footerVisible && (
            <DialogFooter
              className={cn(footerClassName, "flex w-full items-center justify-between! pt-4")}
            >
              {!hideCancelButton && (
                <Button
                  variant={cancelBtnVariant}
                  size={btnSize}
                  onClick={closeHandler}
                  className={cn("px-9 focus-visible:ring-0", btnClassName)}
                >
                  {cancelBtnName}
                </Button>
              )}
              {!hideSubmitButton && (
                <Button
                  variant={submitBtnVariant}
                  type="submit"
                  size={btnSize}
                  onClick={onSubmit}
                  disabled={loading || disableSubmit}
                  className={cn("px-9 focus-visible:ring-0", btnClassName)}
                >
                  {submitBtnName}
                  {loading && <Loader className="size-4" />}
                </Button>
              )}
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;

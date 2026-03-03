import type { ElementType } from "react";
import { FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export interface StatusConfigEntry {
  icon: ElementType;
  label: string;
  className: string;
}

export const STATUS_CONFIG: Record<string, StatusConfigEntry> = {
  none: { icon: FileText, label: "No summary", className: "bg-gray-100 text-gray-500" },
  processing: { icon: Loader2, label: "Generating summary...", className: "bg-amber-50 text-amber-600" },
  ready: { icon: CheckCircle, label: "Summary ready", className: "bg-green-50 text-green-600" },
  failed: { icon: AlertCircle, label: "Generation failed", className: "bg-red-50 text-red-600" },
};

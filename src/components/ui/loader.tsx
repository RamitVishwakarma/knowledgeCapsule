import { Loader2 } from "lucide-react";

import { cn } from "@/components/ui/utils";

export const Loader = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("text-primary animate-spin", className)} />;
};

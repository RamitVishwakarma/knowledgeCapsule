import { toast } from "sonner";

function isActionError(result: unknown): result is { error: string } {
  return (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    typeof (result as Record<string, unknown>).error === "string"
  );
}

export function handleActionResult<T>(
  result: { error: string } | T,
  onSuccess: (result: T) => void
): void {
  if (isActionError(result)) {
    toast.error(result.error);
    return;
  }
  onSuccess(result as T);
}

import { toast } from "sonner";
import type { ActionResponse } from "./response";

export function handleActionResult<T>(
  result: ActionResponse<T>,
  onSuccess: (result: ActionResponse<T>) => void
): void {
  if (!result.status) {
    toast.error(result.errorMessage || result.message || "An error occurred");
    return;
  }
  onSuccess(result);
}

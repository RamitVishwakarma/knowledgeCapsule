export interface ActionResponse<T = unknown> {
  message: string;
  status: boolean;
  code: number;
  errorMessage?: string;
  data?: T;
  token?: string;
}

/**
 * Creates a standardized plain object response for Server Actions.
 * Next.js Server Actions return plain objects, not NextResponses.
 */
export function actionResponse<T = unknown>(
  message: string,
  code: number,
  status: boolean,
  errorMessage?: string,
  data?: T,
  token?: string
): ActionResponse<T> {
  const response: ActionResponse<T> = {
    message,
    status,
    code,
  };

  if (errorMessage !== undefined) {
    response.errorMessage = errorMessage;
  }

  if (data !== undefined) {
    response.data = data;
  }

  if (token !== undefined) {
    response.token = token;
  }

  return response;
}

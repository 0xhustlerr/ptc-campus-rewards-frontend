import type { ApiErrorBody } from "@/lib/api/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const CODE_MESSAGES: Record<string, string> = {
  insufficient_credits: "Insufficient PTC Credits balance for this redemption.",
  invalid_session: "QR expired or already used — ask the student to refresh their QR.",
  wallet_inactive: "This student wallet is not active.",
  note_required: "A note is required for this earning rule.",
  daily_limit: "Daily limit reached for this earning rule.",
  weekly_limit: "Weekly limit reached for this earning rule.",
  out_of_stock: "This reward item is out of stock.",
  redemption_in_progress: "This redemption is already being processed. Please wait.",
  unauthorized: "Your session has expired. Please sign in again.",
  account_pending_approval:
    "Your registration is pending admin approval. You can sign in after an administrator activates your account.",
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "We could not process that request. Please check your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing data. Please refresh and try again.",
  422: "We could not complete this action. Please check the details and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
};

export function getUserFacingErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof ApiError) {
    if (error.code && CODE_MESSAGES[error.code]) {
      return CODE_MESSAGES[error.code];
    }
    if (error.body?.detail && error.body.detail !== "Internal server error") {
      return error.body.detail;
    }
    return STATUS_MESSAGES[error.status] ?? fallback;
  }
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Unable to reach the campus rewards server. Check your connection and try again.";
  }
  return fallback;
}

export async function parseErrorResponse(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | undefined;
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = undefined;
  }
  const code = body?.code;
  const message =
    (code && CODE_MESSAGES[code]) ||
    (body?.detail && body.detail !== "Internal server error" ? body.detail : undefined) ||
    STATUS_MESSAGES[response.status] ||
    "Request failed";
  return new ApiError(message, response.status, code, body);
}

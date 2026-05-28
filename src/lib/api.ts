/**
 * @deprecated Import from `@/lib/api/*` modules or use domain hooks instead.
 * Mock API removed — configure NEXT_PUBLIC_API_BASE_URL for FastAPI.
 */

export { ApiError, getUserFacingErrorMessage } from "@/lib/api/errors";
export { apiRequest, apiGet, apiPost, apiPatch, isApiConfigured, getApiBaseUrl } from "@/lib/api/client";

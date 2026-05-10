interface ApiResponse<T> {
  success: boolean;
  data:    T | null;
  error:   string | null;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success || json.data === null) {
    throw new ApiError(json.error ?? "Unknown API error");
  }

  return json.data;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success || json.data === null) {
    throw new ApiError(json.error ?? "Unknown API error");
  }

  return json.data;
}

export async function apiMutate(method: string, url: string, body?: unknown): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body ?? {}),
  });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<unknown> = await res.json();

  if (!json.success) {
    throw new ApiError(json.error ?? "Unknown API error");
  }
}

export function apiPut(url: string, body: unknown): Promise<void> {
  return apiMutate("PUT", url, body);
}

export function apiDelete(url: string, body?: unknown): Promise<void> {
  return apiMutate("DELETE", url, body);
}

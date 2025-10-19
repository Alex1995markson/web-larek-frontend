/**
 * API-facing data transfer objects (DTOs) and simple client contract.
 * NOTE: Only data shapes are declared here; no class/interface for views/models.
 */

/** Common HTTP method literals for write operations */
export type ApiPostMethods = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Generic API error for uniform handling upstream */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/** Result helper for functions returning either data or error */
export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/**
 * Card DTO as returned by the backend.
 * Aligned with current domain to reduce mapping at this stage.
 */
export interface CardDTO {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

/** Checkout creation DTOs (adjust as backend evolves) */
export interface CreateOrderDTO {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: Array<{
    id: string;
    qty: number;
  }>;
}

export interface CreateOrderResponseDTO {
  orderId: string;
  total: number;
  createdAt: string; // ISO 8601
}

/**
 * Minimal API client function signatures (no class typing to avoid overcommitment at this stage).
 * You can implement these as plain functions or wrap them later.
 */
export type GetFn = <TResponse = unknown>(endpoint: string, init?: Omit<RequestInit, 'method'>) => Promise<TResponse>;

export type PostFn = <TBody = unknown, TResponse = unknown>(
  endpoint: string,
  body: TBody,
  method?: ApiPostMethods,
  init?: Omit<RequestInit, 'method' | 'body'>
) => Promise<TResponse>;

export interface ApiFns {
  get: GetFn;
  post: PostFn;
}

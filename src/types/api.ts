/**
 * API DTOs and client interface.
 * These types model the data as it comes *from* or is sent *to* the backend API.
 * They can differ from domain models (e.g., naming, optional fields, pagination wrappers).
 */

/** Common HTTP method literals for POST-like operations */
export type ApiPostMethods = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Generic HTTP method type */
export type HttpMethod = 'GET' | ApiPostMethods;

/** Generic API error shape */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/** A simple Result type to standardize client returns if needed */
export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/**
 * Example DTO as received from API. Kept close to the backend contract.
 * If your backend uses different field names, reflect them here and map to domain types elsewhere.
 */
export interface CardDTO {
  id: string;                 // backend may use `id` instead of `_id`
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Optional: DTOs for order/checkout flows (customize as your API evolves) */
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
  createdAt: string; // ISO
}

/**
 * API client interface (no implementation here).
 * Implementations should be side-effect free regarding global state and use fetch/XHR underneath.
 */
export interface IApiClient {
  baseUrl: string;

  get<TResponse = unknown>(endpoint: string, init?: Omit<RequestInit, 'method'>): Promise<TResponse>;

  post<TBody = unknown, TResponse = unknown>(
    endpoint: string,
    body: TBody,
    method?: ApiPostMethods,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<TResponse>;

  /** A convenience method to normalize fetch Response -> JSON or ApiError (optional) */
  handleResponse?<T = unknown>(response: Response): Promise<T>;
}

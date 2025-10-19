/**
 * Base contracts: event broker and shared helpers for MVP layers.
 */

/** Event handler function */
export type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

/** Map event name -> payload type */
export type EventMap = Record<string, unknown>;

/**
 * Strongly-typed event broker interface compatible with a typical EventEmitter.
 * Implementations should guarantee that handlers receive payloads matching the event's type.
 */
export interface IEvents<T extends EventMap = EventMap> {
  on<K extends keyof T & string>(event: K, handler: EventHandler<T[K]>): void;
  off?<K extends keyof T & string>(event: K, handler: EventHandler<T[K]>): void;
  emit<K extends keyof T & string>(event: K, payload: T[K]): void;

  /**
   * Returns a function which, when called, emits the specified event with a payload.
   * Useful to pass as callbacks to DOM listeners or view components.
   */
  trigger<K extends keyof T & string>(event: K, payload: T[K]): () => void;
}

/** Utility generics (optional) */
export type Nullable<T> = T | null;
export type NonEmptyArray<T> = [T, ...T[]];

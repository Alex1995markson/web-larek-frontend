/**
 * Event names and payloads for the app's broker.
 * This keeps the system strongly-typed without prescribing class shapes.
 */

import type { ICard, IForm, TContacts, TPayment } from './domain';

/** Union of all event names */
export type AppEventName =
  // Data change events
  | 'order:changed'
  | 'contacts:changed'
  | 'cards:changed'
  // UI events (single modal approach compatible)
  | 'modal:open'                 // payload specifies modal kind + optional data
  | 'modal:close'
  | 'card:select'
  | 'basket:update'
  | 'basket:clear'
  | 'card-basket:delete'
  // Form and validation
  | 'order:validation'
  | 'contacts:validation'
  | 'order:input'
  | 'contacts:input'
  | 'order:submit'
  | 'contacts:submit';

/** Payload map per event */
export interface AppEventPayloads {
  // Data change events
  'order:changed': TPayment;
  'contacts:changed': TContacts;
  'cards:changed': ICard[];

  // UI/modal events (single reusable modal)
  'modal:open':
    | { kind: 'order' }
    | { kind: 'contacts' }
    | { kind: 'card'; cardId: string }
    | { kind: 'basket' }
    | { kind: 'success-payment' };
  'modal:close': void;

  'card:select': { cardId: string };

  // Basket mutations summarized as one event
  'basket:update': { items: ICard[]; total: number };
  'basket:clear': void;
  'card-basket:delete': { cardId: string };

  // Validation and form input events
  'order:validation': { isValid: boolean };
  'contacts:validation': { isValid: boolean };

  'order:input': { name: keyof IForm; value: string };
  'contacts:input': { name: keyof IForm; value: string };

  // Submits carry normalized projections
  'order:submit': TPayment;
  'contacts:submit': TContacts;
}

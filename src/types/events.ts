/**
 * Application event names and payloads used by the event broker.
 * Keep these aligned with the presenter wiring in index.ts.
 */

import type { ICard, IForm, TContacts, TPayment } from './domain';

export type AppEventName =
  | 'order:open'
  | 'contacts:open'
  | 'card:open'
  | 'basket:open'
  | 'success-payment:open'
  | 'card:select'
  | 'card-basket:register'
  | 'order:register'
  | 'contacts:register'
  | 'card-basket:delete'
  | 'order:validation'
  | 'contacts:validation'
  | 'payment:edit'
  | 'order:input'
  | 'contacts:input'
  | 'order:submit'
  | 'contacts:submit'
  | 'new-card:edit'
  | 'basket:clear'
  | 'contacts:clear'
  | 'order:clear'
  | 'order:changed'
  | 'contacts:changed'
  | 'cards:changed';

/**
 * Event payload mapping. Events with `void` payloads should be emitted with `undefined`.
 * If your emitter does not support void, set payload to `{}`.
 */
export interface AppEventMap {
  // Data change events (models)
  'order:changed': TPayment;
  'contacts:changed': TContacts;
  'cards:changed': ICard[];

  // UI interaction events (views)
  'order:open': void;
  'contacts:open': void;
  'card:open': { cardId: string };
  'basket:open': void;
  'success-payment:open': void;

  'card:select': { cardId: string };
  'card-basket:register': void;
  'order:register': void;
  'contacts:register': void;

  'card-basket:delete': { cardId: string };

  'order:validation': { isValid: boolean };
  'contacts:validation': { isValid: boolean };

  'payment:edit': { payment: string };

  'order:input': { name: keyof IForm; value: string };
  'contacts:input': { name: keyof IForm; value: string };

  'order:submit': TPayment;
  'contacts:submit': TContacts;

  'new-card:edit': { card: ICard };

  'basket:clear': void;
  'contacts:clear': void;
  'order:clear': void;
}

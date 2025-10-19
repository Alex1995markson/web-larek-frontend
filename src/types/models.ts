/**
 * Data-model interfaces.
 * These interfaces describe the *stateful* model layer (M in MVP).
 */

import type { ICard, IForm, TCardBasket, TContacts, TPayment } from './domain';
import type { IEvents } from './base';

export interface ICardsData {
  cards: ICard[];
  preview: string | null;
  getCard(cardId: string): ICard;
}

export interface IBasketData {
  total: number;
  items: ICard[];

  addCard(card: ICard): void;
  deleteCard(cardId: string): void;

  /**
   * NOTE: Method name follows the original specification (typo preserved).
   * You may add an alias in the implementation layer if desired.
   */
  clearBuscket(data?: Record<keyof TCardBasket, string>): void;

  getList(): ICard[];
}

export interface IUserData {
  /**
   * Persist payment and address information.
   * Convention: accepts full form but returns the projection used by the next step.
   */
  setUserInfo(userData: IForm): TPayment;

  /**
   * Persist contact information.
   * Convention: accepts full form but returns the projection used by the next step.
   */
  setUserContacts(userData: IForm): TContacts;

  /** Clear all stored user-related data in the model */
  clearData(): void;
}

/** Optional: stateful model base with event broker exposure */
export interface IEventedModel {
  events: IEvents;
}

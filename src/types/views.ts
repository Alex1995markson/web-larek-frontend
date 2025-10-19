/**
 * View-layer contracts (V in MVP).
 * Each view renders into a container and communicates exclusively via events and method calls.
 */

import type { ICard } from './domain';

export interface IRenderable<TElement = HTMLElement> {
  render(): TElement;
}

export interface IModal extends IRenderable {
  open(): void;
  close(): void;
}

export interface IModalWithOrder extends IModal {
  readonly submitButton: HTMLButtonElement;
  readonly formName: string;
  setValid(isValid: boolean): void;
  setInputValues(data: Record<string, string>): void;
}

export interface IModalWithContacts extends IModal {
  readonly submitButton: HTMLButtonElement;
  readonly formName: string;
  setValid(isValid: boolean): void;
  setInputValues(data: Record<string, string>): void;
}

export interface IModalWithCard extends IModal {
  cardId: string;
}

export interface IModalWithConfirm extends IModal {
  readonly submitButton: HTMLButtonElement;
  open(handleSubmit: () => void): void;
}

export interface ICardView extends IRenderable {
  /** Assign card data for rendering */
  setData(cardData: ICard): void;
  /** Unique card identifier (proxy to the underlying model id) */
  readonly id: string;
}

export interface ICardsContainer {
  /** Replace current content with given card elements */
  set cards(elements: HTMLElement[]);
}

export interface IBasketView {
  /** Replace current basket items with given elements */
  setData(cardElements: HTMLElement[]): void;

  /** Remove a specific card from the basket by id */
  deleteCard(cardId: string): void;
}

export interface IBasketPreview {
  /** Number of items in basket */
  totalCards: number;

  /** Open the basket modal */
  open(): void;
}

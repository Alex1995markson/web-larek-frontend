/**
 * Core domain entities and shared type aliases.
 * These types represent the entities the application manipulates.
 * They are intentionally framework-agnostic.
 */

export interface ICard {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

/** A minimal projection of ICard used for basket line items in UI */
export type TCardBasket = Pick<ICard, 'title' | 'price'>;

/** A projection of form fields used for the payment step */
export type TPayment = Pick<IForm, 'payment' | 'address'>;

/** A projection of form fields used for the contacts step */
export type TContacts = Pick<IForm, 'email' | 'phone'>;

/** A projection containing only the total purchase amount */
export type TPurchase = {
  total: number;
};

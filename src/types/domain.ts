/**
 * Domain data types (entities and projections).
 * Kept minimal and framework-agnostic.
 */

/** Unique identifier type for domain entities */
export type Id = string;

/** Core product card as used across the application */
export interface ICard {
  _id: Id;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

/** User form inputs collected during checkout flows */
export interface IForm {
  payment: string;
  email: string;
  phone: string;
  /** NB: fixed typo to `address` */
  address: string;
}

/** Basket line item projection used in UI summaries */
export type TCardBasket = Pick<ICard, 'title' | 'price'>;

/** Payment step projection */
export type TPayment = Pick<IForm, 'payment' | 'address'>;

/** Contacts step projection */
export type TContacts = Pick<IForm, 'email' | 'phone'>;

/** Purchase summary projection */
export type TPurchase = {
  total: number;
};

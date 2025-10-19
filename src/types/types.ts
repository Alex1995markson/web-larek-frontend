
// Полное описание товара, полученное с API 
export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null; 
    index?: string;
}

// Данные о заказе, которые отправляются на сервер
export interface IOrder {
payment: PaymentMethod;
email: string;
phone: string;
address: string;
total: number; 
items: string[]; 
}

export interface IOrderConfirmed {
  id: string;
  total: number;
}

export interface IBasket {
  items: string[];
	total: number;
}

// Описание интерфейса данных покупателя
export interface IUser {
	payment?: PaymentMethod;
	address?: string;
	email?: string;
	phone?: string;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export type PaymentMethod = 'card' | 'cash' | '';

export interface IOrderFormData extends IOrder {
  valid: boolean;
  errors: string;
}
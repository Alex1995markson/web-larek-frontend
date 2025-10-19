# Проектная работа «Веб-ларёк» — README (с оглавлением)

> Этот документ формализует **базовые классы**, их назначение и функции, отражая архитектуру по парадигме **MVP (Model-View-Presenter)**. Опционально к проекту может быть приложена UML-схема (диаграмма классов/последовательностей) для визуализации.

## Содержание

- [1) Базовые сущности и типы](#1-базовые-сущности-и-типы)
  - [Полное описание товара (DTO, приходит с API)](#полное-описание-товара-dto-приходит-с-api)
  - [Данные о заказе (отправляются на сервер)](#данные-о-заказе-отправляются-на-сервер)
- [2) Архитектура (MVP)](#2-архитектура-mvp)
- [3) Описание базовых классов](#3-описание-базовых-классов)
  - [3.1. Базовый класс для работы с API](#31-базовый-класс-для-работы-с-api)
  - [3.2. Model (слой данных и логики)](#32-model-слой-данных-и-логики)
    - [BasketModel](#basketmodel)
    - [AppState](#appstate)
    - [CardsModel](#cardsmodel)
  - [3.3. View (слой отображения)](#33-view-слой-отображения)
    - [CardView](#cardview)
    - [BasketView](#basketview)
    - [Header](#header)
    - [Gallery](#gallery)
    - [Modal (универсальное окно)](#modal-универсальное-окно)
    - [Order (форма заказа)](#order-форма-заказа)
    - [Contacts (форма контактов)](#contacts-форма-контактов)
    - [SuccessView](#successview)
  - [3.4. Базовые классы (инфраструктура)](#34-базовые-классы-инфраструктура)
    - [Component](#component)
    - [EventEmitter](#eventemitter)
- [4) События приложения](#4-события-приложения)
- [5) Работа с DOM](#5-работа-с-dom)
- [6) Дополнительно (UML)](#6-дополнительно-uml)
- [7) Установка и запуск](#7-установка-и-запуск)

---

## 1) Базовые сущности и типы

Ниже — ключевые **данные, приходящие с API**, и **данные, отправляемые на сервер**. Они соответствуют текущей контрактной модели.

### Полное описание товара (DTO, приходит с API)

```ts
export interface IItem {
  id: string;          // идентификатор
  description: string; // описание
  image: string;       // фото
  title: string;       // наименование
  category: string;    // категория
  price: number | null;// если не указана — null
  index?: string;      // порядковый номер (опционально)
}
```

### Данные о заказе (отправляются на сервер)

```ts
export type PaymentMethod = 'card' | 'cash' | '';

export interface IOrder {
  payment: PaymentMethod; // 'card' — картой, 'cash' — при получении, '' — не выбрано
  email: string;          // эмейл
  phone: string;          // телефон
  address: string;        // адрес
  total: number;          // сумма заказа
  items: string[];        // массив ID товаров
}

export interface IOrderConfirmed {
  id: string;
  total: number;
}

export interface IBasket {
  items: string[]; // список ID товаров в корзине
  total: number;   // сумма по корзине
}

export interface IUser {
  payment?: PaymentMethod;
  address?: string;
  email?: string;
  phone?: string;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

/** Валидационные данные формы заказа на клиенте */
export interface IOrderFormData extends IOrder {
  valid: boolean;
  errors: string;
}
```

---

## 2) Архитектура (MVP)

Приложение организовано по **MVP**:

- **Model (Модель)** — слой данных и бизнес-логики.
- **View (Представление)** — слой отображения и пользовательских взаимодействий.
- **Presenter (Посредник)** — связывает Model и View через событийный брокер.

---

## 3) Описание базовых классов

### 3.1. Базовый класс для работы с API

```ts
export class Api {
  readonly baseUrl: string;     // Базовый URL API
  protected options: RequestInit;// Настройки запросов по умолчанию

  // Конструктор класса
  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',      // JSON-заголовок
        ...(options.headers as object ?? {}),    // Пользовательские заголовки
      },
      ...options,
    };
  }

  // Базовые методы (реализации зависят от проекта)
  async get<T = unknown>(uri: string): Promise<T> { /* ... */ throw new Error('not implemented'); }
  async post<T = unknown>(uri: string, data: object, method: 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<T> { /* ... */ throw new Error('not implemented'); }
}
```

---

### 3.2. Model (слой данных и логики)

#### BasketModel
**Назначение:** управляет состоянием корзины; добавление/удаление товаров, подсчёт суммы и количества.

**Конструктор:**
```ts
constructor(events: IEvents) // events — брокер событий
```

**Методы:**
- `addToBasket(item: IItem): void` — добавить товар;
- `removeFromBasket(id: string): void` — удалить товар;
- `getBasketTotal(): number` — получить общую сумму;
- `getBasketCount(): number` — получить количество товаров;
- `isInBasket(id: string): boolean` — проверить наличие товара;
- `getItems(): IItem[]` — получить все товары в корзине;
- `clearBasket(): void` — очистить корзину.

#### AppState
**Назначение:** глобальное состояние (товары, выбранный товар, корзина, данные заказа).

**Конструктор:**
```ts
constructor(data: Partial<AppState>, events: IEvents)
```

**Свойства:**
- `items: IItem[]` — список товаров;
- `selectedItem: IItem | null` — выбранный товар;
- `basket: IBasket` — данные корзины;
- `order: IOrder` — данные заказа.

**Методы:**
- `setItems(items: IItem[]): void` — установить список товаров;
- `setSelectedItem(item: IItem): void` — выбрать товар;
- `setFieldsOder(): void` — установить поля заказа;
- `validation(): boolean` — валидация данных заказа/контактов.

#### CardsModel
**Назначение:** каталог товаров; хранит загруженные товары.

**Конструктор:**
```ts
constructor(events: IEvents)
```

**Методы:**
- `setItems(items: IItem[]): void` — установить список товаров.

---

### 3.3. View (слой отображения)

#### CardView
**Назначение:** карточка товара (каталог/превью).

**Конструктор:**
```ts
constructor(container: HTMLElement, events?: ICardActions)
```

**Методы:**
- `updateButtonState(isInBasket: boolean): void` — обновить состояние кнопки.

#### BasketView
**Назначение:** отображение корзины.

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

**Методы:**
- `updateItems(items: HTMLElement[]): void` — обновить список товаров;
- `setTotal(value: number): void` — установить общую сумму;
- `refreshIndices(): void` — обновить порядковые номера.

#### Header
**Назначение:** иконка корзины + счётчик товаров.

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

#### Gallery
**Назначение:** контейнер каталога карточек.

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

**Методы:**
- `setCatalog(items: HTMLElement[]): void` — установить каталог.

#### Modal (универсальное окно)
**Назначение:** единое модальное окно.

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

**Методы:**
- `modalOpen(): void` — открыть;
- `modalClose(): void` — закрыть.

#### Order (форма заказа)
**Назначение:** форма заказа (адрес + способ оплаты).

**Конструктор:**
```ts
constructor(container: HTMLFormElement, events: IEvents)
```

**Методы:**
- `selectPayment(payment: 'card' | 'cash'): void` — выбор способа оплаты;
- `validateForm(): boolean` — валидация формы.

#### Contacts (форма контактов)
**Назначение:** форма контактных данных (email, телефон).

**Конструктор:**
```ts
constructor(container: HTMLFormElement, events: IEvents)
```

#### SuccessView
**Назначение:** экран успешного оформления заказа.

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

---

### 3.4. Базовые классы (инфраструктура)

#### Component
**Назначение:** базовый компонент для всех View.

**Конструктор:**
```ts
constructor(protected readonly container: HTMLElement)
```

**Методы:**
- `render(data?: Partial<unknown>): HTMLElement` — отрисовка.

**Утилиты для DOM:**
- `toggleClass`, `setText`, `setDisabled`, `setHidden`, `setVisible`, `setImage`.

#### EventEmitter
**Назначение:** брокер событий (Observer).

**Методы:**
- `on(eventName: EventName, callback: (event: T) => void)` — подписка;
- `off(eventName: EventName, callback: Subscriber)` — отписка;
- `emit(eventName: string, data?: T)` — инициирование события;
- `trigger(eventName: string, context?: Partial<unknown>)` — фабрика колбэков.

---

## 4) События приложения

Приложение использует систему событий для связи компонентов.

```ts
export enum AppStateChanges {
  items = 'items:change',         // загрузка/изменение товаров
  select = 'item:select',         // выбор товара
  modalOpen = 'modal:open',       // открытие модалки
  modalClose = 'modal:close',     // закрытие модалки
  basket = 'basket:changed',      // корзина изменилась
  basketOpen = 'basket:open',     // открытие корзины
  order = 'order:change',         // изменение данных заказа
  orderOpen = 'order:open',       // открытие формы заказа
  orderSubmit = 'order:submit',   // отправка формы заказа
  contactsSubmit = 'contacts:submit', // отправка формы контактов
  orderDone = 'order:done',       // заказ оформлен успешно
  error = 'message:error',        // ошибки формы/приложения
  success = 'success:newPurchase' // успешная покупка
}
```

---

## 5) Работа с DOM

Для безопасной работы с DOM используются утилиты:

- `ensureElement<T>(selector: string, container?: HTMLElement): T` — гарантированное получение элемента;
- `cloneTemplate<T>(template: HTMLTemplateElement): T` — клонирование шаблона;
- `createElement<K extends keyof HTMLElementTagNameMap>(tag: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]` — создание элемента.

---

## 6) Дополнительно (UML)

Опционально рекомендуется добавить:
- диаграмму классов (Class Diagram) для Model/View/Presenter и их связей;
- диаграмму последовательностей (Sequence Diagram) для ключевых сценариев: «добавление в корзину», «оформление заказа».

---

## 7) Установка и запуск

```bash
npm install
npm run start
# сборка:
npm run build
```

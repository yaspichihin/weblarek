export interface HeaderData {
  counter: number;
}

export interface GalleryData {
  catalog: HTMLElement[];
}

export interface ModalData {
  content: HTMLElement;
}

export interface BasketData {
  items: HTMLElement[];
  total: number;
}

export interface SuccessData {
  total: number;
}

export interface CardData {
  id: string;
  title: string;
  price: string | null;
}

export interface CardCatalogData extends CardData {
  image: string;
  category: string;
}

export interface CardPreviewData extends CardData {
  image: string;
  category: string;
  description: string;
  buttonText: string;
}

export interface CardBasketData extends CardData {
  index: number;
}

export interface FormData {
  valid: boolean;
  errors: string[];
}

export interface OrderFormData extends FormData {
  payment: "cash" | "card";
  address: string;
}

export interface ContactsFormData extends FormData {
  email: string;
  phone: string;
}

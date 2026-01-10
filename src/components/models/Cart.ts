import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private _products: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    // Тут логика работы с изменяемыми данными.
    // Защита от изменения состояния списка
    // продуктов из вне по полученной ссылке.
    return [...this._products];
  }

  addProduct(product: IProduct) {
    this._products.push(product);
    this.events.emit("cart:changed");
  }

  removeProduct(product: IProduct) {
    this._products = this._products.filter((item) => item !== product);
    this.events.emit("cart:changed");
  }

  clearCart() {
    this._products = [];
    this.events.emit("cart:changed");
  }

  getCartLength(): number {
    return this._products.length;
  }

  getCartPrice(): number {
    return this._products.reduce((acc, item) => {
      const price = item.price ? item.price : 0;
      return acc + price;
    }, 0);
  }

  isProductInCart(productId: string): boolean {
    return this._products.some((product) => product.id === productId);
  }
}

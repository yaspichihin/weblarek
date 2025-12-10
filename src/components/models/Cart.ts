import {IProduct} from "../../types"

export class Cart {
  private _products: IProduct[];

  constructor(
    products: IProduct[] = [],
  ) {
    this._products = [...products];
  }

  getProducts():IProduct[] {
    return [...this._products];
  }

  addProduct(product: IProduct) {
    this._products.push(product)
  }

  removeProduct(product: IProduct) {
    this._products = this._products.filter(item => item !== product)
  }

  clearCart() {
    this._products = []
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
    const product = this._products.find(product => product.id === productId);
    return !!product;
  }
}
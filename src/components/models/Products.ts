import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    return [...this._products];
  }

  setProducts(newProducts: IProduct[]): void {
    this._products = [...newProducts];
    this.events.emit("products:changed", { products: this._products });
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }

  setSelectedProduct(newProduct: IProduct | null): void {
    this._selectedProduct = newProduct;
    this.events.emit("product:selected", { product: newProduct });
  }

  getProduct(productId: string): IProduct | null {
    const product = this._products.find((product) => product.id === productId);
    return product || null;
  }
}

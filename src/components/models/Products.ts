import {IProduct} from "../../types"

export class Products {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor() {}

  getProducts(): IProduct[] {
    return [...this._products];
  }

  setProducts(newProducts: IProduct[]): void {
    this._products = [...newProducts];
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }

  setSelectedProduct(newProduct: IProduct | null): void {
    this._selectedProduct = newProduct;
  }

  getProduct(productId: string): IProduct | null {
    const product = this._products.find(product => product.id === productId);
    return product || null;
  }
}
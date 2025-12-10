import {IApi, IProduct, IOrder, IOrderResponse} from "../../types";

interface IProductResponse {
  items: IProduct[];
  total: number;
}

export class ApiService {

  // Композиция API
  constructor(private api: IApi) {}

  // Получить все продукты с сервера
  getProducts(): Promise<IProductResponse> {
    return this.api.get('/product/');
  }

  postOrder(orderData: IOrder): Promise<IOrderResponse> {
    return this.api.post('/order/', orderData);
  }
}

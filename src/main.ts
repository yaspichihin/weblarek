import { API_URL } from "./utils/constants.ts"
import { Api } from "./components/base/Api.ts"
import { ApiService } from "./components/services/ApiService.ts";
import { Products } from "./components/models/Products.ts";
import { Cart } from "./components/models/Cart.ts";
import { Buyer } from "./components/models/Buyer.ts";

import './scss/styles.scss';
import {IOrderResponse, IProduct} from "./types";


// ApiService

const api = new Api(API_URL);
const apiService = new ApiService(api);

// Не согласен, чистая функция все хорошо, изменять экземпляр класса нужно явно что я и делаю на 62 строке.
async function getData() : Promise<IProduct[]> {
  try {
    const productResponse = await apiService.getProducts();
    return productResponse.items;
  }
  catch (err) {
    console.error('Ошибка: ', err);
    return [];
  }
}

async function postOrder() : Promise<IOrderResponse| null>  {
  try {
    return await apiService.postOrder({
      payment: "online",
      email: "a@a.a",
      phone: '123',
      address: 'asdf',
      total: 2200,
      items: [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
      ]
    })
  }
  catch(err) {
    console.error('Ошибка: ', err);
    return null;
  }
}

const productCollection = await getData()
const orderResponse = await postOrder();

console.log('Проверка создания заказа: ', orderResponse)


// Products

// Проверка создания экземпляра
const products = new Products();
console.log('Массив товаров из каталога: ', products.getProducts());

// Проверка установки коллекции продуктов
products.setProducts(productCollection)
console.log('Массив товаров из каталога: ', products.getProducts());

// Проверка получение продукта по ID
const products_product = products.getProduct('1c521d84-c48d-48fa-8cfb-9d911fa515fd');
console.log('Получение продукта по ID: ', products_product);

// Проверка получения выбранного продукта
products.getSelectedProduct()
console.log('Получение выбранного продукта: ', products.getSelectedProduct());

// Проверка установки выбранного продукта
products.setSelectedProduct(products_product);
console.log('Получение выбранного продукта: ', products.getSelectedProduct());


// Cart

// Проверка создания корзины
const cart = new Cart();
console.log('Проверка создания корзины: ', cart);

// Проверка наполнения корзины
for(let i: number=0; i<3; i++) {
  cart.addProduct(products.getProducts()[i]);
}

// Проверка, что продукты добавлены
console.log('Проверка, что продукты добавлены:', cart.getProducts());

// Проверка кол-ва продуктов в корзине
console.log('Проверка кол-ва продуктов в корзине: ', cart.getCartLength());

// Проверка получения суммы всей корзины
console.log('Проверка получения суммы всей корзины: ', cart.getCartPrice())

// Проверка наличия продукта в корзине
const cart_product = cart.getProducts()[0]
console.log('Проверка наличия продукта в корзине', cart.isProductInCart(cart_product.id))

// Проверка удаления товара из корзины
cart.removeProduct(cart_product)
console.log('Проверка наличия продукта в корзине',  cart.isProductInCart(cart_product.id))
console.log('Проверка кол-ва продуктов в корзине: ', cart.getCartLength());

// Проверка очистки корзины
cart.clearCart()
console.log('Проверка кол-ва продуктов в корзине: ', cart.getCartLength());


// Buyer

// Проверка создания покупателя
const buyer = new Buyer();
console.log(buyer.getBuyerInfo())

// Проверка изменения способа оплаты
buyer.setPayment('card')
console.log('Проверка изменения способа оплаты: ', buyer.getPayment())
console.log('Проверка изменения способа оплаты: ', buyer.getBuyerInfo())

// Проверка изменения адреса
buyer.setAddress('Saint-Petersburg')
console.log('Проверка изменения адреса: ', buyer.getAddress())
console.log('Проверка изменения адреса: ', buyer.getBuyerInfo())

// Проверка изменения email
buyer.setEmail('a@a.a')
console.log('Проверка изменения email: ', buyer.getEmail())
console.log('Проверка изменения email: ', buyer.getBuyerInfo())

// Проверка изменения телефона
buyer.setPhone('54321')
console.log('Проверка изменения телефона: ', buyer.getPhone())
console.log('Проверка изменения телефона: ', buyer.getBuyerInfo())

// Проверка очистки данных о покупателе
buyer.clearBuyerInfo()
console.log('Проверка очистки данных о покупателе: ', buyer.getBuyerInfo())

// Проверка валидации
console.log("Проверка валидации: ", buyer.validate())
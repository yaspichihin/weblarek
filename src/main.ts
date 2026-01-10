import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { ApiService } from "./components/services/ApiService";

// Модели
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";

// View компоненты
import { Header, Modal, Gallery, Basket, Success, CardCatalog, CardPreview, CardBasket, OrderForm, ContactsForm } from "./components/view";

import "./scss/styles.scss";

// Инициализация
const api = new Api(API_URL);
const apiService = new ApiService(api);
const events = new EventEmitter();
const products = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Основные контейнеры
const headerContainer = document.querySelector(".header") as HTMLElement;
const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const modalContainer = document.querySelector("#modal-container") as HTMLElement;

// Темплейты
const cardCatalogTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector("#card-basket") as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
const successTemplate = document.querySelector("#success") as HTMLTemplateElement;

// View
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

// Обработка изменения каталога товаров
events.on("products:changed", () => {
  const cardsHTML = products.getProducts().map((product) => {
    const cardElement = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(cardElement.querySelector(".card")!, {
      onClick: () => events.emit("card:select", { id: product.id }),
    });

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price ? `${product.price} синапсов` : null,
      image: product.image,
      category: product.category,
    });
  });

  gallery.catalog = cardsHTML;
});

// Открытие карточки
events.on("card:select", ({ id }: { id: string }) => {
  const product = products.getProduct(id);
  if (!product) return;

  products.setSelectedProduct(product);

  const cardElement = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
  const card = new CardPreview(cardElement.querySelector(".card")!, {
    onClick: () => {
      if (cart.isProductInCart(product.id)) {
        events.emit("card:remove", { id: product.id });
      } else {
        events.emit("card:add", { id: product.id });
      }
    },
  });

  const cardContainer = card.render({
    id: product.id,
    title: product.title,
    price: product.price ? `${product.price} синапсов` : null,
    image: product.image,
    category: product.category,
    description: product.description,
    buttonText: cart.isProductInCart(product.id) ? "Удалить из корзины" : "В корзину",
  });

  // Блокируем кнопку если цена null
  if (product.price === null) {
    card.buttonText = "Недоступно";
    card.buttonDisabled = true;
  }

  modal.content = cardContainer;
  modal.open();
});

// Обработка изменения корзины (обновление счетчика)
events.on("cart:changed", () => {
  header.counter = cart.getCartLength();
});

// Добавление в корзину
events.on("card:add", ({ id }: { id: string }) => {
  const product = products.getProduct(id);
  if (product) {
    cart.addProduct(product);
    modal.close();
  }
});

// Удаление из корзины
events.on("card:remove", ({ id }: { id: string }) => {
  const product = products.getProduct(id);
  if (product) {
    cart.removeProduct(product);

    // Закрытие модалки при удалении из карточки
    if (products.getSelectedProduct()?.id === id) {
      modal.close();
    }

    // Обновление корзины если открыта
    const basketElement = modalContainer.querySelector(".basket");
    if (basketElement) {
      events.emit("basket:open");
    }
  }
});

// Открытие корзины
events.on("basket:open", () => {
  const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basket = new Basket(basketElement.querySelector(".basket")!, events);

  const cardsHTML = cart.getProducts().map((product, index) => {
    const cardElement = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardBasket(cardElement.querySelector(".card")!, {
      onDelete: () => events.emit("card:remove", { id: product.id }),
    });

    return card.render({
      id: product.id,
      title: product.title,
      price: product.price ? `${product.price} синапсов` : "Бесценно",
      index: index + 1,
    });
  });

  const basketContainer = basket.render({
    items: cardsHTML,
    total: cart.getCartPrice(),
  });

  modal.content = basketContainer;
  modal.open();
});

// Обработка изменения данных покупателя
events.on("buyer:changed", () => {
  // Определяем какая форма открыта и валидируем соответствующую
  const orderForm = modalContainer.querySelector('form[name="order"]');
  const contactsForm = modalContainer.querySelector('form[name="contacts"]');

  if (orderForm) {
    validateOrder();
  } else if (contactsForm) {
    validateContacts();
  }
});

// Оформление заказа
events.on("basket:order", () => {
  const orderElement = orderTemplate.content.cloneNode(true) as HTMLElement;
  const orderForm = new OrderForm(orderElement.querySelector(".form") as HTMLFormElement, events);
  modal.content = orderForm.render();
});

// Выбор способа оплаты
events.on("order:payment", ({ payment }: { payment: string }) => {
  buyer.setPayment(payment as "card" | "cash");
});

// Ввод адреса
events.on("order:address", ({ address }: { address: string }) => {
  buyer.setAddress(address);
});

// Валидация формы оплаты
function validateOrder() {
  const errors = buyer.validate();
  const errorMessages: string[] = [];

  if (errors.payment) errorMessages.push(errors.payment);
  if (errors.address) errorMessages.push(errors.address);
  const isValid = !errors.payment && !errors.address;

  events.emit("order:valid", {
    valid: isValid,
    errors: errorMessages,
  });
}

events.on("order:valid", ({ valid, errors }: { valid: boolean; errors: string[] }) => {
  const form = modalContainer.querySelector('form[name="order"]') as HTMLFormElement;
  if (form) {
    const orderForm = new OrderForm(form, events);
    orderForm.valid = valid;
    orderForm.errors = errors;
  }
});

// Отправка формы оплаты
events.on("order:submit", () => {
  const contactsElement = contactsTemplate.content.cloneNode(true) as HTMLElement;
  const contactsForm = new ContactsForm(contactsElement.querySelector(".form") as HTMLFormElement, events);
  modal.content = contactsForm.render();
});

// Ввод email
events.on("contacts:email", ({ email }: { email: string }) => {
  buyer.setEmail(email);
});

// Ввод телефона
events.on("contacts:phone", ({ phone }: { phone: string }) => {
  buyer.setPhone(phone);
});

// Валидация формы контактов
function validateContacts() {
  const errors = buyer.validate();
  const errorMessages: string[] = [];

  if (errors.email) errorMessages.push(errors.email);
  if (errors.phone) errorMessages.push(errors.phone);

  const isValid = !errors.email && !errors.phone;

  events.emit("contacts:valid", {
    valid: isValid,
    errors: errorMessages,
  });
}

events.on("contacts:valid", ({ valid, errors }: { valid: boolean; errors: string[] }) => {
  const form = modalContainer.querySelector('form[name="contacts"]') as HTMLFormElement;
  if (form) {
    const contactsForm = new ContactsForm(form, events);
    contactsForm.valid = valid;
    contactsForm.errors = errors;
  }
});

// Отправка формы контактов
events.on("contacts:submit", async () => {
  try {
    const orderData = {
      ...buyer.getBuyerInfo(),
      total: cart.getCartPrice(),
      items: cart.getProducts().map((p) => p.id),
    };

    const result = await apiService.postOrder(orderData);

    if (result) {
      const successElement = successTemplate.content.cloneNode(true) as HTMLElement;
      const success = new Success(successElement.querySelector(".order-success")!, events);

      const successContainer = success.render({
        total: cart.getCartPrice(),
      });

      modal.content = successContainer;
    }
  } catch (error) {
    console.error("Ошибка отправки заказа:", error);
  }
});

// Закрытие экрана успеха
events.on("success:close", () => {
  modal.close();
  cart.clearCart();
  buyer.clearBuyerInfo();
});

// Закрытие модалки
events.on("modal:close", () => {
  // Очищаем выбранный товар
  products.setSelectedProduct(null);
});

// Запуск приложения
async function init() {
  try {
    const data = await apiService.getProducts();
    products.setProducts(data.items); // Генерирует products:changed
  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
  }
}

init();

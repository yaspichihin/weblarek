import { Form } from "./Form";
import { OrderFormData } from "../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class OrderForm extends Form<OrderFormData> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(container.querySelectorAll(".order__buttons .button")) as HTMLButtonElement[];
    this._addressInput = ensureElement<HTMLInputElement>("input[name=address]", container);

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.payment = button.name as "card" | "cash";
        this.events.emit("order:payment", { payment: button.name });
      });
    });

    this._addressInput.addEventListener("input", () => {
      this.events.emit("order:address", { address: this._addressInput.value });
    });
  }

  set payment(value: "card" | "cash") {
    this._paymentButtons.forEach((button) => {
      if (button.name === value) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}

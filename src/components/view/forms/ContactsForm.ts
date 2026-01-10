import { Form } from "./Form";
import { ContactsFormData } from "../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class ContactsForm extends Form<ContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._emailInput = ensureElement<HTMLInputElement>("input[name=email]", container);
    this._phoneInput = ensureElement<HTMLInputElement>("input[name=phone]", container);

    this._emailInput.addEventListener("input", () => {
      this.events.emit("contacts:email", { email: this._emailInput.value });
    });

    this._phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:phone", { phone: this._phoneInput.value });
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}

import { TPayment, IBuyer, IValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private _payment: TPayment = "";
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  constructor(protected events: IEvents) {}

  getPayment(): TPayment {
    return this._payment;
  }

  setPayment(newPayment: TPayment) {
    this._payment = newPayment;
    this.events.emit("buyer:changed");
  }

  getAddress(): string {
    return this._address;
  }

  setAddress(newAddress: string): void {
    this._address = newAddress;
    this.events.emit("buyer:changed");
  }

  getEmail(): string {
    return this._email;
  }

  setEmail(newEmail: string): void {
    this._email = newEmail;
    this.events.emit("buyer:changed");
  }

  getPhone(): string {
    return this._phone;
  }

  setPhone(newPhone: string): void {
    this._phone = newPhone;
    this.events.emit("buyer:changed");
  }

  getBuyerInfo(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clearBuyerInfo() {
    this._payment = "";
    this._address = "";
    this._email = "";
    this._phone = "";
    this.events.emit("buyer:changed");
  }

  validate(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this._payment.trim()) {
      errors.payment = "Укажите вид оплаты";
    }

    if (!this._address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this._email.trim()) {
      errors.email = "Укажите email";
    }

    if (!this._phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}

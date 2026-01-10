import { Component } from "../../base/Component";
import { CardData } from "../types";
import { ensureElement } from "../../../utils/utils";

export abstract class Card<T extends CardData> extends Component<T> {
  protected _id!: string;
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: string | null) {
    if (value === null) {
      this._price.textContent = "Бесценно";
    } else {
      this._price.textContent = value;
    }
  }
}

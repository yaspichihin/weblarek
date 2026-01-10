import { Component } from "../base/Component";
import { BasketData } from "./types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Basket extends Component<BasketData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._total = ensureElement<HTMLElement>(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(".basket__button", container);

    this._button.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    this._button.disabled = items.length === 0;
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}

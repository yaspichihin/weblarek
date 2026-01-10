import { Card } from "./Card";
import { CardBasketData } from "../types";
import { ensureElement } from "../../../utils/utils";

export class CardBasket extends Card<CardBasketData> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onDelete?: () => void }) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    if (actions?.onDelete) {
      this._deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}

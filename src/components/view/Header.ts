import { Component } from "../base/Component";
import { HeaderData } from "./types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Header extends Component<HeaderData> {
  protected _basketButton: HTMLButtonElement;
  protected _counter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._basketButton = ensureElement<HTMLButtonElement>(".header__basket", container);
    this._counter = ensureElement<HTMLElement>(".header__basket-counter", container);

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}

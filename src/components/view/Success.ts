import { Component } from "../base/Component";
import { SuccessData } from "./types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Success extends Component<SuccessData> {
  protected _total: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = ensureElement<HTMLElement>(".order-success__description", container);
    this._closeButton = ensureElement<HTMLButtonElement>(".order-success__close", container);

    this._closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}

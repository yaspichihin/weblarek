import { Component } from "../base/Component";
import { ModalData } from "./types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Modal extends Component<ModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);
    this._content = ensureElement<HTMLElement>(".modal__content", container);

    this.container.setAttribute("tabindex", "-1");
    this.container.addEventListener("click", this.close.bind(this));
    this._closeButton.addEventListener("click", this.close.bind(this));
    this._content.addEventListener("click", (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  private _handleEscapeClose = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  open(): void {
    this.container.classList.add("modal_active");
    this.container.addEventListener("keydown", this._handleEscapeClose);
    this.container.focus();
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.container.removeEventListener("keydown", this._handleEscapeClose);
    this._content.replaceChildren();
    this.events.emit("modal:close");
  }

  render(data: ModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}

import { Component } from "../../base/Component";
import { FormData } from "../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export abstract class Form<T extends FormData> extends Component<T> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>("button[type=submit]", container);
    this._errors = ensureElement<HTMLElement>(".form__errors", container);

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string[]) {
    this._errors.textContent = value.join(", ");
  }
}

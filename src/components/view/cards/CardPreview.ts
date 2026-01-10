import { Card } from "./Card";
import { CardPreviewData } from "../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../utils/constants";

export class CardPreview extends Card<CardPreviewData> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onClick?: () => void }) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this._image, CDN_URL + value, this._title.textContent || "");
  }

  set category(value: string) {
    this._category.textContent = value;
    this._category.className = "card__category";

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this._category.classList.add(categoryClass);
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}

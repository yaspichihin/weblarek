import { Card } from "./Card";
import { CardCatalogData } from "../types";
import { ensureElement } from "../../../utils/utils";
import { CDN_URL, categoryMap } from "../../../utils/constants";

export class CardCatalog extends Card<CardCatalogData> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: { onClick?: () => void }) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
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
}

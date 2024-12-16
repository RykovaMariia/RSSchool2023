import { CreatorElement } from "../utils/CreatorElement.js";

export class BaseView {
  /**
   * @param {string} tag
   * @param {Array<string>} classNames
   */
  constructor(tag, classNames = []) {
    this.viewElement = new CreatorElement(tag, classNames);
  }

  getHTMLElement() {
    return this.viewElement.getElement();
  }
}

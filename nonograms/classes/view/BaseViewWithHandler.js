import { CreatorElement } from "../utils/CreatorElement.js";

export class BaseViewWithHandler {
 /**
  * 
  * @param {string} tag 
  * @param {Array} classNames 
  * @param {function} cb 
  */
  constructor(tag, classNames = [], cb = null) {
    this.viewElement = new CreatorElement(tag, classNames, '', cb);
  }

  getCreatorElement() {
    return this.viewElement
  }

  getHTMLElement() {
    return this.viewElement.getElement();
  }
}

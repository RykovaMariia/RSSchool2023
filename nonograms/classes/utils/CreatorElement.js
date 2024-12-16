export class CreatorElement {
  /**
   * @param {string} tag
   * @param {Array<string>} classNames
   * @param {string} text
   * @param {function} cb
   */
  constructor(tag, classNames = [], text, cb) {
    this.tag = tag;
    this.classNames = classNames;
    this.text = text;
    this.cb = cb;

    this.element = null;
    this.createElement();
  }

  /**
   *
   * @returns Element
   */
  getElement() {
    return this.element;
  }

  createElement() {
    this.element = document.createElement(this.tag);

    this.setClassName(this.classNames);
    this.setTextContent(this.text);
    this.setHandler(this.cb);
  }
  /**
   *
   * @param {Array<string>} classes
   */
  setClassName(classes) {
    if (classes.length > 0) {
      classes.forEach((el) => this.element.classList.add(el));
    }
  }

  /**
   *
   * @param {string} text
   */
  setTextContent(text) {
    if (text) {
      this.element.innerText = text;
    }
  }

  /**
   *
   * @param {function} cb
   */
  setHandler(cb) {
    if (typeof cb === "function") {
      this.element.addEventListener("click", (e) => this.cb(e));
    }
  }

  /**
   *
   * @param {Element} element
   */
  appendElement(element) {
    this.element.append(element);
  }
}

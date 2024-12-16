import { BaseViewWithHandler } from "../BaseViewWithHandler.js";
import { CreatorElement } from "../../utils/CreatorElement.js";
import { games } from "../../../data/games.js"

export class ModalView extends BaseViewWithHandler {
  #window;

  /**
   * @param {number} time
   */
  constructor(time, index) {
    super("div", ["modal"], (e) => this.cbModal(e));
    this.appendInnerModal(time, index);
  }

  appendInnerModal(time, index) {
    this.appendWindow();
    this.appendContent(time, index);
    this.appendButtonOk();
  }

  cbModal(e) {
    if (e.target.classList.contains("modal")) {
      this.cbButton();
    }
  }

  appendWindow() {
    this.#window = new CreatorElement("div", ["modal__window"]);
    this.viewElement.appendElement(this.#window.getElement());
  }

  appendContent(time, index) {
    const content = new CreatorElement("div", ["result-game"]);

    const spanGreat = new CreatorElement("span", ["result-game"], 'Great!')
    content.appendElement(spanGreat.getElement());

    const img = new CreatorElement("img", [])
    img.getElement().setAttribute('src', games[index].urlImg);
    img.getElement().setAttribute('alt', ' ');
    content.appendElement(img.getElement());

    const spanTime = new CreatorElement("span", ["result-game"], `You have solved the nonogram\nin ${time} seconds!`)
    content.appendElement(spanTime.getElement());

    this.#window.appendElement(content.getElement());
  }

  appendButtonOk() {
    const button = new CreatorElement(
      "button",
      ["button", "button_modal"],
      "OK",
      () => this.cbButton()
    );
    this.#window.appendElement(button.getElement());
  }

  cbButton() {
    this.viewElement.getElement().remove();
    document.body.classList.remove("lock");
  }
}

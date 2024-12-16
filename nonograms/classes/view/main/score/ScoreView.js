import { CreatorElement } from "../../../utils/CreatorElement.js";
import { BaseViewWithHandler } from "../../BaseViewWithHandler.js";
import { games } from "../../../../data/games.js";

export class ScoreView extends BaseViewWithHandler {
  #wrapper;
  #listElements = [];

  constructor() {
    super("section", ["score"], (e) => this.cbClose(e));
    this.appendInnerScore();
    this.appendTextInList();
  }

  cbClose(e) {
    if (e.target.classList.contains("score")) {
      this.cbCloseButton();
    }
  }

  appendInnerScore() {
    this.appendWrapper();
    this.appendCloseButton();
    this.appendHeading();
    this.appendList();
  }

  appendWrapper() {
    this.#wrapper = new CreatorElement("div", ["score__wrapper"]);
    this.viewElement.appendElement(this.#wrapper.getElement());
  }

  appendCloseButton() {
    const close = new CreatorElement(
      "span",
      ["material-symbols-outlined", "icon-close"],
      "close",
      () => this.cbCloseButton()
    );
    this.#wrapper.appendElement(close.getElement());
  }

  cbCloseButton() {
    this.viewElement.getElement().classList.remove("score_opened");
    document.body.classList.remove("lock");
  }

  appendHeading() {
    const h2 = new CreatorElement("h2", [], "The high score table");
    this.#wrapper.appendElement(h2.getElement());
  }

  appendList() {
    const list = new CreatorElement("div", ["score__list"]);
    this.#wrapper.appendElement(list.getElement());

    const ol = new CreatorElement("ol");
    list.appendElement(ol.getElement());

    for (let i = 0; i < 5; i++) {
      const li = new CreatorElement("li");
      this.#listElements.push(li);
      if (i === 0) {
        li.setClassName(["score__first"]);
      }
      ol.appendElement(li.getElement());
    }
  }

  appendTextInList() {
    let dataScore = [];
    dataScore = JSON.parse(localStorage.getItem("rm-score"));
    if (dataScore && dataScore.length > 0) {
      let sortData = [];
      sortData = dataScore.sort((a, b) => a.time - b.time);

      sortData.forEach((el, i) => {
        const levels = ["easy", "medium", "hard"];
        const name = games[el.index].name;
        const level = levels[games[el.index].level];
        const min = Math.trunc(el.time / 60)
          .toString()
          .padStart(2, "0");
        const sec = (el.time % 60).toString().padStart(2, "0");
        this.#listElements[i].setTextContent(`${name}, ${level} ${min}:${sec}`);
      });
    }
  }
}

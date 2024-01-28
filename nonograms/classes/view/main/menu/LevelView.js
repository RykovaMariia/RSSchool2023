import { CreatorElement } from "../../../utils/CreatorElement.js";
import { BaseView } from "../../BaseView.js";

export class LevelView extends BaseView {
  constructor(levelGame, nameObj) {
    super("div", ["levels"]);
    this.levelGame = levelGame;
    this.nameObj = nameObj;
    this.appendLevels();
  }
  
  levels = ["easy", "medium", "hard"];
  levelElements = [];

  appendLevels() {
    for (let i = 0; i < 3; i++) {
      const divLevel = new CreatorElement("div", ["level"], "", (e) =>
        this.selectedLevel(e)
      );
      divLevel.setTextContent(this.levels[i]);
      if (i === this.levelGame) {
        divLevel.setClassName(["level_selected"]);
      }
      this.viewElement.appendElement(divLevel.getElement());
      this.levelElements.push(divLevel.getElement());
    }
  }

  selectedLevel(e) {
    if (e.target.classList.contains("level")) {
      this.levelElements.forEach((el) => el.classList.remove("level_selected"));
      e.target.classList.add("level_selected");

      this.levelGame = this.levels.indexOf(e.target.innerText);
      this.nameObj.removeNames();
      this.nameObj.appendName(this.levelGame);
    }
  }
}

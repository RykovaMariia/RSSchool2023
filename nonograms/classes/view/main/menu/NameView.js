import { BaseView } from "../../BaseView.js";
import { games } from "../../../../data/games.js";
import { CreatorElement } from "../../../utils/CreatorElement.js";

export class NameView extends BaseView {
  constructor(levelGame, indexGame, gameComponent) {
    super("ul", ["menu__name-game"]);
    this.indexGame = indexGame;
    this.gameComponent = gameComponent;
    this.appendName(levelGame);
  }

  nameElements = [];

  appendName(levelGame) {
    this.nameElements = [];
    games.forEach((el, index) => {
      if (el.level === levelGame) {
        const liName = new CreatorElement("li", ["name-game"], el.name, (e) =>
          this.cbName(e)
        );
        if (index === this.indexGame) {
          liName.setClassName(["name-game_selected"]);
        }
        this.viewElement.appendElement(liName.getElement());
        this.nameElements.push(liName.getElement());
      }
    });
  }

  cbName(e) {
    if (e.target.classList.contains("name-game")) {
      const nameGame = e.target.innerText;
      games.forEach((el, i) => {
        if (el.name === nameGame) {
          this.selectedName(i);
        }
      });
    }
  }

  selectedName(index) {
    this.indexGame = index;
    this.gameComponent.buttonSave.getElement().disabled = true;
    const nameGame = games[index].name;
    this.nameElements.forEach((el) => {
      el.classList.remove("name-game_selected");

      if (el.innerText === nameGame) {
        el.classList.add("name-game_selected");
      }
    });

    this.gameComponent.removeField();
    this.gameComponent.appendField(index);
  }

  removeNames() {
    this.nameElements.forEach((el) => el.remove());
  }
}

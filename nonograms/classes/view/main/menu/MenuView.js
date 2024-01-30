import { CreatorElement } from "../../../utils/CreatorElement.js";
import { BaseView } from "../../BaseView.js";
import { LevelView } from "./LevelView.js";
import { NameView } from "./NameView.js";
import { games } from "../../../../data/games.js";

export class MenuView extends BaseView {
  constructor(startNameGame, gameComponent) {
    super("section", ["menu"]);
    this.startLevel = games[startNameGame].level;
    this.namesGame = new NameView(
      this.startLevel,
      startNameGame,
      gameComponent
    );
    this.levels = new LevelView(this.startLevel, this.namesGame);

    this.appendInnerMenu(gameComponent);
  }

  appendInnerMenu(gameComponent) {
    this.appendHeading();
    this.appendLevels();
    this.appendNamesGame();
    this.appendButtonRandom();
    this.appendButtonContinueLastGame(gameComponent);
  }

  appendHeading() {
    const h2 = new CreatorElement("h2", [], "Menu");
    this.viewElement.appendElement(h2.getElement());
  }

  appendLevels() {
    this.viewElement.appendElement(this.levels.getHTMLElement());
  }

  appendNamesGame() {
    this.viewElement.appendElement(this.namesGame.getHTMLElement());
  }

  appendButtonRandom() {
    const buttonRandom = new CreatorElement(
      "button",
      ["button_random-game", "button"],
      "random",
      () => this.cbRandomButton()
    );
    this.viewElement.appendElement(buttonRandom.getElement());
  }

  cbRandomButton() {
    const randomIndex = Math.floor(Math.random() * games.length);

    this.level = games[randomIndex].level;
    this.levels.selectedLevel(this.level);
    this.namesGame.selectedName(randomIndex);
  }

  appendButtonContinueLastGame(gameComponent) {
    const buttonContinue = new CreatorElement(
      "button",
      ["button_continue-last-game", "button"],
      "Continue last game",
      () => this.cbContinueLastGame(gameComponent)
    );
    this.viewElement.appendElement(buttonContinue.getElement());
  }

  cbContinueLastGame(gameComponent) {
    /**
     * @typedef {{
     * id: number,
     * cell: Array<number>,
     * time: Array<number>,
     * }} lastGame
     */
    const lastGame = JSON.parse(localStorage.getItem("saveGame"));
    gameComponent.continueLastGame(lastGame);
  }
}

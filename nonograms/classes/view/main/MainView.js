import { CreatorElement } from "../../utils/CreatorElement.js";
import { BaseView } from "../BaseView.js";
import { GameView } from "./game/GameView.js";
import { MenuView } from "./menu/MenuView.js";
import { ScoreView } from "./score/ScoreView.js";

const START_NAME_INDEX = 0;

export class MainView extends BaseView {
  #burger;

  constructor() {
    super("main");
    this.appendMain();
  }

  appendMain() {
    const score = new ScoreView();
    this.viewElement.appendElement(score.getHTMLElement());

    const game = new GameView(START_NAME_INDEX, score);
    this.viewElement.appendElement(game.getHTMLElement());

    const menu = new MenuView(START_NAME_INDEX, game);
    this.viewElement.appendElement(menu.getHTMLElement());

    this.appendBurger(game, menu.getHTMLElement());
    this.appendScoreButton(game, score.getHTMLElement());
    this.appendSwitchTheme(game);
    this.clickHandlerGameCloseMenu(
      game.getHTMLElement(),
      menu.getHTMLElement()
    );
  }

  appendBurger(game, menuEl) {
    this.#burger = new CreatorElement("div", ["burger"], "", () =>
      this.cbBurger(menuEl)
    );

    for (let i = 0; i < 3; i++) {
      const burgerLine = new CreatorElement("div", ["burger__line"]);
      this.#burger.appendElement(burgerLine.getElement());
    }

    game.viewElement.appendElement(this.#burger.getElement());
  }

  cbBurger(menuEl) {
    menuEl.classList.toggle("menu_opened");
    this.#burger.getElement().classList.toggle("burger_opened");
    document.body.classList.toggle("lock");
  }

  appendScoreButton(game, scoreEl) {
    const button = new CreatorElement(
      "button",
      ["button", "button_score"],
      "Score",
      () => this.cbScoreButton(scoreEl)
    );
    game.viewElement.appendElement(button.getElement());
  }

  cbScoreButton(scoreEl) {
    scoreEl.classList.toggle("score_opened");
    document.body.classList.add("lock");
  }

  clickHandlerGameCloseMenu(gameEl, menuEl) {
    gameEl.addEventListener("click", (e) => {
      if (!e.target.closest(".burger")) {
        menuEl.classList.remove("menu_opened");
        this.#burger.getElement().classList.remove("burger_opened");
        document.body.classList.remove("lock");
      }
    });
  }

  appendSwitchTheme(game) {
    const switchTheme = new CreatorElement("label", ["switch"], "");
    game.viewElement.appendElement(switchTheme.getElement());

    const input = new CreatorElement("input");
    input.getElement().setAttribute("type", "checkbox");
    switchTheme.appendElement(input.getElement());

    this.theme(input.getElement());

    const switchToggle = new CreatorElement("span", ["switch-toggle"], "", () =>
      this.cbToggleSwitchTheme()
    );
    switchTheme.appendElement(switchToggle.getElement());
  }

  cbToggleSwitchTheme() {
    const theme = JSON.parse(localStorage.getItem("rm-darkTheme"));
    if (theme) {
      document.body.classList.remove("dark");
      localStorage.removeItem("rm-darkTheme");
    } else {
      localStorage.setItem("rm-darkTheme", true);
      document.body.classList.add("dark");
    }
  }

  theme(input) {
    const theme = JSON.parse(localStorage.getItem("rm-darkTheme"));
    if (theme) {
      document.body.classList.add("dark");
      input.checked = true;
    }
  }
}

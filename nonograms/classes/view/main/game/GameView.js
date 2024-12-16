import { CreatorElement } from "../../../utils/CreatorElement.js";
import { BaseView } from "../../BaseView.js";
import { games } from "../../../../data/games.js";
import { ModalView } from "../../modal/ModalView.js";

export class GameView extends BaseView {
  /**
   *
   * @param {number} gameIndex
   */
  constructor(gameIndex, score) {
    super("section", ["game"]);
    this.gameIndex = gameIndex;
    this.score = score;
    this.appendInnerGame();
  }
  #table;
  #timeDiv;
  buttonSave;

  #nonogramsCluesTop = [];
  #nonogramsCluesLeft = [];

  interval;
  sec = 0;
  min = 0;

  cells = [];

  #audioBlackCell;
  #audioWhileCell;
  #audioCrossCell;
  #audioWin;

  appendInnerGame() {
    this.appendAudio();
    this.appendHeading();
    this.appendTime();
    this.appendField(this.gameIndex);
    this.appendButtons();
  }

  addAudio() {
    this.#audioBlackCell = new Audio("assets/music/tap_1.mp3");
    this.#audioWhileCell = new Audio("assets/music/tap_2.mp3");
    this.#audioCrossCell = new Audio("assets/music/tcs.mp3");
    this.#audioWin = new Audio("assets/music/win.mp3");
  }

  removeAudio() {
    this.#audioBlackCell = null;
    this.#audioWhileCell = null;
    this.#audioCrossCell = null;
    this.#audioWin = null;
  }
  /**
   * @param {Audio} audio
   */
  async audioPlay(audio) {
    if (audio) {
      await this.#audioBlackCell.pause();
      await this.#audioWhileCell.pause();
      await this.#audioCrossCell.pause();
      await this.#audioWin.pause();

      audio.currentTime = 0;
      await audio.play();
    }
  }

  appendAudio() {
    const audioDiv = new CreatorElement("div", ["audio"], '', () => this.cbSound(audioDiv.getElement(), icon));
    this.viewElement.appendElement(audioDiv.getElement());

    const icon = new CreatorElement("span", [
      "material-symbols-outlined",
      "icon-sound",
    ]);
    audioDiv.appendElement(icon.getElement());
      icon.setTextContent("brand_awareness");
      this.addAudio();

      audioDiv.setHandler()
  }

  cbSound(audioDiv, icon) {
    if (audioDiv.classList.contains("sound-off")) {
      this.addAudio();
      audioDiv.classList.remove('sound-off');
      icon.setTextContent("brand_awareness");
    } else {
      this.removeAudio();
      audioDiv.classList.add('sound-off');
      icon.setTextContent("no_sound");
    }
  }

  appendHeading() {
    const h1 = new CreatorElement("h1", [], "Nonograms");
    this.viewElement.appendElement(h1.getElement());
  }

  appendTime() {
    this.#timeDiv = new CreatorElement("div", ["game__time"], "00:00");
    this.viewElement.appendElement(this.#timeDiv.getElement());
  }

  appendField(gameIndex) {
    this.resetTime();
    this.#timeDiv.setTextContent("00:00");
    this.cells = [];
    this.gameIndex = gameIndex;
    const level = games[gameIndex].level;

    this.#table = new CreatorElement("table", ["nonograms"]);
    if (this.#table.getElement().classList.contains("nonograms_disabled")) {
      this.#table.getElement().classList.remove("nonograms_disabled");
    }
    this.viewElement.appendElement(this.#table.getElement());
    const tbody = new CreatorElement("tbody");
    this.#table.appendElement(tbody.getElement());

    let cell = "cell";
    if (level === 1) cell = "cell-medium";
    if (level === 2) cell = "cell-small";

    const n = (level + 1) * 5 + 1;

    for (let i = 0; i < n; i++) {
      const tr = new CreatorElement("tr");
      tbody.appendElement(tr.getElement());

      if (i % 5 === 1) {
        tr.setClassName(["first"]);
      }

      if (i % 5 === 0 && i !== 0) {
        tr.setClassName(["five"]);
      }

      for (let j = 0; j < n; j++) {
        const td = new CreatorElement("td", [], "", (e) => this.cbClickCell(e));

        if (i === 0 && j > 0) {
          td.setClassName(["nonograms__top"]);
          this.#nonogramsCluesTop.push(td);
        }
        if (j === 0 && i === 0) {
          td.setClassName(["nonograms__top_none"]);
        }
        if (j === 0 && i !== 0) {
          td.setClassName(["nonograms__left"]);
          this.#nonogramsCluesLeft.push(td);
        }
        if (i > 0 && j > 0) {
          td.setClassName(["cell", cell]);
          this.cells.push(td.getElement());
        }
        if (j % 5 === 1) {
          td.setClassName(["cell_first"]);
        }
        if (j % 5 === 0) {
          td.setClassName(["cell_five"]);
        }

        tr.appendElement(td.getElement());
      }
    }
    this.createClues(gameIndex);
    this.clickRightMouse(this.#table.getElement());
  }

  appendButtons() {
    const buttonsDiv = new CreatorElement("div", ["game__buttons"]);
    this.viewElement.appendElement(buttonsDiv.getElement());

    this.buttonSave = new CreatorElement(
      "button",
      ["button", "button_save-game"],
      "Save game",
      () => this.cbSaveGame()
    );
    this.buttonSave.getElement().disabled = true;
    buttonsDiv.appendElement(this.buttonSave.getElement());

    const buttonSolution = new CreatorElement(
      "button",
      ["button", "button_solution"],
      "Solution",
      () => this.cbSolution()
    );
    buttonsDiv.appendElement(buttonSolution.getElement());

    const buttonReset = new CreatorElement(
      "button",
      ["button", "button_reset-game"],
      "Reset game",
      () => this.cbResetButton()
    );
    buttonsDiv.appendElement(buttonReset.getElement());
  }

  createClues(gameIndex) {
    const solution = games[gameIndex].game;
    const cluesLeft = [];
    const cluesTop = [];

    for (let i = 0; i < solution.length; i++) {
      const cluesLeftInner = [];
      let countLeft = 0;

      const cluesTopInner = [];
      let countTop = 0;

      for (let j = 0; j < solution.length; j++) {
        if (solution[i][j] === 1) {
          countLeft++;
          if (j === solution.length - 1 || solution[i][j + 1] === 0) {
            cluesLeftInner.push(countLeft);
            countLeft = 0;
          }
        }
        if (solution[j][i] === 1) {
          countTop++;
          if (j === solution.length - 1 || solution[j + 1][i] === 0) {
            cluesTopInner.push(countTop);
            countTop = 0;
          }
        }
      }
      cluesLeft.push(cluesLeftInner);
      cluesTop.push(cluesTopInner);
    }
    this.#nonogramsCluesLeft.forEach((el, i) => {
      el.setTextContent(cluesLeft[i].join(" ") || "0");
    });
    this.#nonogramsCluesTop.forEach((el, i) => {
      el.setTextContent(cluesTop[i].join("\n") || "0");
    });
  }

  cbClickCell(e) {
    if (e.target.classList.contains("cell")) {
      if (!this.#table.getElement().classList.contains("nonograms_disabled")) {
        this.startTime();
        this.buttonSave.getElement().disabled = false;
        e.target.classList.remove("cell_cross");

        if (e.target.classList.contains("cell_dark")) {
          this.audioPlay(this.#audioWhileCell);
          e.target.classList.remove("cell_dark");
        } else {
          this.audioPlay(this.#audioBlackCell);
          e.target.classList.add("cell_dark");
        }

        const result = this.cells.map((el) => {
          if (el.classList.contains("cell_dark")) {
            el = 1;
          } else {
            el = 0;
          }
          return el;
        });
        const solution = games[this.gameIndex].game.flat(1);
        if (
          result.length === solution.length &&
          solution.every((el, i) => el === result[i])
        ) {
          this.winGame();
        }
      }
    }
  }

  startTime() {
    if (!this.#timeDiv.getElement().classList.contains("time-go")) {
      this.#timeDiv.setClassName(["time-go"]);
      this.interval = setInterval(() => this.updateTime(), 1000);
    }
  }

  winGame() {
    const time = this.min * 60 + this.sec;
    this.buttonSave.getElement().disabled = true;

    this.audioPlay(this.#audioWin);

    this.saveWinInLocalStorage(time);
    this.score.appendTextInList();
    const modal = new ModalView(time, this.gameIndex);
    document.body.prepend(modal.getHTMLElement());
    document.body.classList.add("lock");

    this.resetTime();
    this.#table.setClassName(["nonograms_disabled"]);
  }

  saveWinInLocalStorage(time) {
    const thisWin = { index: this.gameIndex, time: time };
    let dataScore = [];

    if (!localStorage.getItem("rm-score")) {
      dataScore.push(thisWin);
      localStorage.setItem("rm-score", JSON.stringify(dataScore));
    } else {
      dataScore = JSON.parse(localStorage.getItem("rm-score"));

      if (dataScore.length > 4) {
        dataScore.shift();
      }
      dataScore.push(thisWin);
      localStorage.setItem("rm-score", JSON.stringify(dataScore));
    }
  }

  clickRightMouse(table) {

    table.addEventListener("contextmenu", (e) => {
      if (e.target.classList.contains("cell")) {
        e.preventDefault();

        if (!table.classList.contains("nonograms_disabled")) {
          this.startTime();
          this.buttonSave.getElement().disabled = false;

          e.target.classList.remove("cell_dark");
          if (e.target.classList.contains("cell_cross")) {
            this.audioPlay(this.#audioWhileCell);
            e.target.classList.remove("cell_cross");
          } else {
            this.audioPlay(this.#audioCrossCell);
            e.target.classList.add("cell_cross");
          }
        }
      }
    });
  }

  removeField() {
    this.#nonogramsCluesTop = [];
    this.#nonogramsCluesLeft = [];
    this.#table.getElement().innerHTML = "";
    this.#table.getElement().remove();
  }

  updateTime() {
    this.sec++;
    if (this.sec === 60) {
      this.min++;
      this.sec = 0;
    }

    this.#timeDiv.setTextContent(
      `${this.min.toString().padStart(2, "0")}:${this.sec
        .toString()
        .padStart(2, "0")}`
    );
  }

  resetTime() {
    clearInterval(this.interval);
    this.min = 0;
    this.sec = 0;
    this.#timeDiv.getElement().classList.remove("time-go");
  }

  cbResetButton() {
    this.buttonSave.getElement().disabled = true;
    this.removeField();
    this.appendField(this.gameIndex);
  }

  cbSaveGame() {
    document.querySelector(".button_continue-last-game").disabled = false;
    const result = this.cells.map((el) => {
      if (el.classList.contains("cell_dark")) {
        el = 1;
      } else if (el.classList.contains("cell_cross")) {
        el = 2;
      } else {
        el = 0;
      }
      return el;
    });
    const saveGame = {
      id: this.gameIndex,
      time: [this.min, this.sec],
      cell: result,
    };
    localStorage.setItem("rm-saveGame", JSON.stringify(saveGame));
  }

  continueLastGame(saveGame) {
    this.removeField();
    this.appendField(saveGame.id);
    this.min = saveGame.time[0];
    this.sec = saveGame.time[1];

    const result = saveGame.cell;

    result.map((el, i) => {
      if (el === 1) {
        this.cells[i].classList.add("cell_dark");
      }
      if (el === 2) {
        this.cells[i].classList.add("cell_cross");
      }
      return el;
    });
    this.#timeDiv.setTextContent(
      `${this.min.toString().padStart(2, "0")}:${this.sec
        .toString()
        .padStart(2, "0")}`
    );
    this.#timeDiv.setClassName(["time-go"]);
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  cbSolution() {
    this.buttonSave.getElement().disabled = true;
    const solution = games[this.gameIndex].game.flat(1);
    solution.map((el, i) => {
      this.cells[i].classList.remove("cell_cross");
      if (el === 1) {
        this.cells[i].classList.add("cell_dark");
      } else {
        this.cells[i].classList.remove("cell_dark");
      }
      return el;
    });
    this.resetTime();
    this.#table.setClassName(["nonograms_disabled"]);
  }
}

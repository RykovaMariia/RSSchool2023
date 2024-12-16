import { alphabetEng } from "./alphabetLetter.js";
import { alphabetRu } from "./alphabetLetter.js";
import { Modal } from "./Modal.js";
import { Svg } from "./Svg.js";

export class HangmanGame {
  constructor({ word, hint, incorrectGuesses = 0 }) {
    this.word = word;
    this.hint = hint;
    this.incorrectGuesses = incorrectGuesses;
    this.displayWord = this.hideWord();
  }

  svgElement = new Svg();

  clickedKey = [];

  main = document.createElement("main");
  header = document.createElement("header");
  alarm = document.createElement("div");
  divKeyboard = document.createElement("div");

  generateHeader() {
    let heading = document.createElement("h1");
    heading.innerText = "Hangman Game";

    this.header.appendChild(heading);
    return this.header;
  }

  hideWord() {
    console.info(`answer: ${this.word.toUpperCase()}`);
    this.displayWord = this.word.replace(/[a-zA-Z]/g, "_");
    return this.displayWord;
  }

  generateMain() {
    this.main.className = "game";

    let sectionPicture = document.createElement("section");
    sectionPicture.className = "picture";

    sectionPicture.append(this.svgElement.createSvg());

    let sectionGameplay = document.createElement("section");
    sectionGameplay.className = "gameplay";

    let divWord = document.createElement("div");
    divWord.className = "gameplay__word";
    divWord.innerText = `${this.displayWord}`;

    let divHint = document.createElement("div");
    divHint.className = "hint";
    divHint.innerText = `Hint: `;

    let spanHint = document.createElement("span");
    spanHint.className = "hint__text";
    spanHint.innerText = `${this.hint}`;

    divHint.append(spanHint);

    let divGuesses = document.createElement("div");
    divGuesses.className = "incorrect-guesses";
    divGuesses.innerText = `Incorrect guesses: `;

    let spanGuessesCount = document.createElement("span");
    spanGuessesCount.className = "incorrect-guesses__count";
    spanGuessesCount.innerText = `${this.incorrectGuesses}`;
    let spanGuesses = document.createElement("span");
    spanGuesses.innerText = `/6`;

    divGuesses.append(spanGuessesCount);
    divGuesses.append(spanGuesses);

    
    this.divKeyboard.className = "keyboard";

    alphabetEng.forEach((el) => {
      let divKey = document.createElement("button");
      divKey.className = "button keyboard__button";
      divKey.innerText = `${el}`;

      this.divKeyboard.append(divKey);
    });

    sectionGameplay.append(divWord);
    sectionGameplay.append(divHint);
    sectionGameplay.append(divGuesses);
    sectionGameplay.append(this.divKeyboard);

    this.main.append(sectionPicture);
    this.main.append(sectionGameplay);
    return this.main;
  }

  generateAlarm() {
    this.alarm.className = "alarm-window";

    let img = document.createElement("img");
    img.className = "modal-alarm";
    img.setAttribute("src", "./assets/alarm.gif");
    img.setAttribute("alt", "");

    let modal = document.createElement("div");
    modal.className = "alarm-lang";
    modal.innerText = "please change the language to English";

    this.alarm.append(img);
    this.alarm.append(modal);
    return this.alarm;
  }

  showGame() {
    document.body.prepend(this.generateMain());
    document.body.prepend(this.generateHeader());
    document.body.prepend(this.generateAlarm());

    this.buttonsClickHandler();
    this.buttonsKeyboardHandler();
    this.isWin();
  }

  deleteGame() {
    document.querySelector("main").remove();
    document.querySelector("header").remove();
    document.querySelector(".alarm-window").remove();
  }

  buttonsClickHandler() {
    document.querySelector(".keyboard").addEventListener("click", (e) => {
      if (e.target.classList.contains("keyboard__button")) {
        let letter = e.target.innerText;

        const indexes = this.searchIndexes(letter);

        if (indexes.length > 0) {
          this.hideButton(e.target);
          this.unhideLetter(indexes, letter);
        } else {
          this.addIncorrectGuesses();
          this.hideButton(e.target);
        }
        this.clickedKey.push(letter);
      }
    });
  }

  buttonsKeyboardHandler() {
    document.addEventListener("keyup", this);
    this.handleEvent = function (e) {
      let letter = e.key.toLowerCase();
      let indexEngLetter = alphabetEng.indexOf(letter);
      let indexRuLetter = alphabetRu.indexOf(letter);

      if (!this.clickedKey.includes(letter)) {
        const el = document.querySelector(
          `.keyboard__button:nth-child(${indexEngLetter + 1})`
        );

        if (indexEngLetter >= 0) {
          const indexes = this.searchIndexes(letter);

          if (indexes.length > 0) {
            this.hideButton(el);
            this.unhideLetter(indexes, letter);
          } else {
            this.addIncorrectGuesses();
            this.hideButton(el);
          }
          this.clickedKey.push(letter);
        }
        if (indexRuLetter >= 0) {
          const alarm = document.querySelector(".alarm-window");

          alarm.classList.add("alarm-window_open");

          setTimeout(() => {
            alarm.classList.remove("alarm-window_open");
          }, 4000);
        }
      }
    };
  }

  searchIndexes(letter) {
    let currentWord = this.word.split("");

    let index = [];
    currentWord.forEach((el, i) => {
      if (el === letter) {
        index.push(i);
      }
    });
    return index;
  }

  hideButton(el) {
    el.classList.add("keyboard__button_hide");
    el.disabled = true;
  }

  unhideLetter(indexes, letter) {
    const wordEl = document.querySelector(".gameplay__word");
    this.displayWord = this.displayWord.split("");

    indexes.forEach((i) => (this.displayWord[i] = letter));

    this.displayWord = this.displayWord.join("");
    wordEl.innerText = this.displayWord;

    if (!this.displayWord.includes("_")) {
      this.getIsWin(true);
    }
  }

  addIncorrectGuesses() {
    this.incorrectGuesses++;
    if (this.incorrectGuesses <= 6) {
      document.querySelector(".incorrect-guesses__count").innerText =
        this.incorrectGuesses;
      this.svgElement.drawHangman(this.incorrectGuesses);
    }

    if (this.incorrectGuesses >= 6) {
      this.getIsWin(false);
    }
  }

  getIsWin(boolean) {
    const isWin = boolean;
    if (isWin || isWin === false) {
      this.divKeyboard.childNodes.forEach(el => el.disabled = true);
      
      document.removeEventListener("keyup", this);
      localStorage.setItem("isWin", isWin);
    }
  }

  isWin() {
    document.querySelector(".keyboard").addEventListener("click", (e) => {
      if (e.target.classList.contains("keyboard__button")) {
        const isWinOrLoose = localStorage.getItem("isWin");

        if (isWinOrLoose === "false") {
          const modal = new Modal(this.word, false);
          modal.showModal();
          localStorage.setItem("isWin", "");
        } else if (isWinOrLoose === "true") {
          const modal = new Modal(this.word, true);
          modal.showModal();
          localStorage.setItem("isWin", "");
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      const isWinOrLoose = localStorage.getItem("isWin");
      if (isWinOrLoose === "false") {
        const modal = new Modal(this.word, false);
        modal.showModal();
        localStorage.setItem("isWin", "");
      } else if (isWinOrLoose === "true") {
        const modal = new Modal(this.word, true);
        modal.showModal();
        localStorage.setItem("isWin", "");
      }
    });
  }
}

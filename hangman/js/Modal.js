import { HangmanGame } from "./HangmanGame.js";
import { words } from "./Words.js";

export class Modal {
  constructor(word, isWin) {
    this.word = word;
    this.isWin = isWin;
  }

  modal = document.createElement("div");
  button = document.createElement("button");

  wonOrLost() {
    return this.isWin ? "won" : "lost";
  }

  generateModal() {
    this.modal.className = "modal";

    let modalWindow = document.createElement("div");
    modalWindow.className = "modal__window";

    let result = document.createElement("div");
    result.className = "result-game";
    result.innerText = `You've ${this.wonOrLost()}!`;

    let divImg;
    if (this.isWin) {
      divImg = this.generateWinner();
    } else {
      divImg = this.generateLooser();
    }

    let answer = document.createElement("div");
    answer.className = "modal__answer";
    answer.innerText = `answer: ${this.word}`;

    this.button.className = "button modal__button";
    this.button.innerText = "play again";

    modalWindow.append(result);
    modalWindow.append(divImg);
    modalWindow.append(answer);
    modalWindow.append(this.button);

    this.modal.append(modalWindow);

    return this.modal;
  }

  generateWinner() {
    let divImg = document.createElement("div");

    let imgRight = document.createElement("img");
    imgRight.className = "modal__firework_right";
    imgRight.setAttribute("src", "./assets/firework.webp");
    imgRight.setAttribute("alt", "");

    let imgLeft = document.createElement("img");
    imgLeft.className = "modal__firework_left";
    imgLeft.setAttribute("src", "./assets/firework.webp");
    imgLeft.setAttribute("alt", "");

    let img = document.createElement("img");
    img.className = "modal__img";
    img.setAttribute("src", "./assets/giphy.webp");
    img.setAttribute("alt", "");

    divImg.append(img);
    divImg.append(imgRight);
    divImg.append(imgLeft);

    return divImg;
  }

  generateLooser() {
    let divImg = document.createElement("div");

    let img = document.createElement("img");
    img.className = "modal__img";
    img.setAttribute("src", "./assets/nooo.webp");
    img.setAttribute("alt", "");

    divImg.append(img);

    return divImg;
  }

  showModal() {
    document.body.prepend(this.generateModal());
    this.playAgainClickHandler();
    document.body.classList.add("lock");
  }

  playAgainClickHandler() {
    this.button.addEventListener("click", () => {
      let currentNumber = +localStorage.getItem("currentNumber");
      if (currentNumber < words.length - 1) {
        currentNumber += 1;
      } else {
        currentNumber = 0;
      }
      localStorage.setItem("currentNumber", currentNumber);

      const game = new HangmanGame(words[currentNumber]);
      game.deleteGame();
      game.showGame();

      this.modal.remove();

      document.body.classList.remove("lock");
    });
  }
}

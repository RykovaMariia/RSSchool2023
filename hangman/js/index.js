import { words } from "./Words.js";
import { HangmanGame } from "./HangmanGame.js";

window.onload = function () {

  console.warn('♡ Dear reviewer ♡ \n\n please use the English keyboard layout\n ');

  playGame();

};

export function playGame() {
  const game = new HangmanGame(words[randomWord()]);
  game.showGame();
}



function randomWord() {
  let currentNumber = Math.floor(Math.random() * ((words.length - 1) - 0) + 0);
  let localNumber = localStorage.getItem('currentNumber') || 0;
  if (currentNumber === localNumber) {
    currentNumber = randomWord();
  } else {
    localStorage.setItem('currentNumber', currentNumber);
    return currentNumber;
  }
}
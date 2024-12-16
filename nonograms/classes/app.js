import { MainView } from "./view/main/MainView.js";

export class App {
  constructor() {
    this.createView();
  }

  createView() {
    const main = new MainView();
    document.body.prepend(main.getHTMLElement());
  }
}

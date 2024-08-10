import Game, { ResourceLoader } from "../chips";
import { GameHandler } from "../chips";

let handler = new (class implements GameHandler {
  onConfig() {
    return {
      name: "Test",
    };
  }

  onLoad(loader: ResourceLoader) {}

  onEnd() {}
})();

let game = new Game(handler);
game.launch();

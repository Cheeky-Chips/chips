import Game, { ResourceLoader } from "../chips";
import { GameHandler } from "../chips";
import { Color } from "../chips/game/object";
import { V } from "../chips/game/utils";

let handler = new (class implements GameHandler {
  onUpdate(): void {}
  onConfig() {
    return {
      name: "Test",
    };
  }

  onLoad(loader: ResourceLoader) {
    let color = new Color(V(0, 0), V(100, 100), "red", 0, "rrr");
    color.load();
  }

  onEnd() {}
})();

let game = new Game(handler);
game.launch();

import Game, { ResourceLoader } from "../chips";
import { GameHandler } from "../chips";
import { Color } from "../chips/game/object";
import { V } from "../chips/game/utils";
import { Controller } from "../chips/game/control";

let handler = new (class implements GameHandler {
  onUpdate(): void {}
  onConfig() {
    return {
      name: "Test",
    };
  }

  onLoad(loader: ResourceLoader) {
    let color = new Color(V(10, 10), V(100, 100), "red", 0, "rrr");
    Controller.useMovementController(color);

    color.onClick = (obj, cood, rCood) => {
      console.log("Clicked ", rCood.t());
      return true;
    };

    color.load();
  }

  onEnd() {}
})();

let game = new Game(handler);
game.launch();

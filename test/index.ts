import Game, { ResourceLoader } from "../chips";
import { GameHandler } from "../chips";
import { Color } from "../chips/game/object";
import { V } from "../chips/game/utils";
import { Controller } from "../chips/game/control";
import { ColorAnimation } from "../chips/game/animation";

let handler = new (class implements GameHandler {
  onUpdate(): void {}
  onConfig() {
    return {
      name: "Test",
    };
  }

  onLoad(loader: ResourceLoader) {
    let color = new Color(V(10, 10), V(100, 100), "r", 0, "red");
    Controller.useMovementController(color);
    Controller.useCameraController(color);

    color.load();

    let color2 = new Color(V(50, 50), V(100, 100), "b", 0, "black");
    color2.runAnimation(new ColorAnimation(color2, ["red", "blue"]));
    color2.load();
  }

  onEnd() {}
})();

let game = new Game(handler);
game.launch();

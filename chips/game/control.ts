import Game from "..";
import { GameObject } from "./object";
import { V } from "./utils";

/**
 * Controller
 * A class to represent a controller
 */
export class Controller {
  /**
   * Keybindings for movement
   */
  public static movementKeybindings = ["a", "d", "w", "s"];
  /**
   * States of the movement
   */
  private static states = [false, false, false, false];

  /**
   * Use a movement controller
   * @param {GameObject} target - The target object
   * @param {number} [speed=4] - The speed of the movement
   * @returns {void}
   */
  public static useMovementController(
    target: GameObject,
    speed: number = 4
  ): void {
    const onKeyDown0 = target.onKeyDown;
    const onKeyUp0 = target.onKeyUp;
    const onUpdate0 = target.onUpdate;
    target.onKeyDown = (_obj, key) => {
      if (Controller.movementKeybindings.includes(key)) {
        Controller.states[Controller.movementKeybindings.indexOf(key)] = true;
      }
      return onKeyDown0?.call(target, _obj, key) ?? false;
    };

    target.onKeyUp = (_obj, key) => {
      if (Controller.movementKeybindings.includes(key)) {
        Controller.states[Controller.movementKeybindings.indexOf(key)] = false;
      }
      return onKeyUp0?.call(target, _obj, key) ?? false;
    };
    target.onUpdate = (obj) => {
      if (Controller.states[0]) {
        obj.cood = obj.cood.add(V(-speed, 0));
      }
      if (Controller.states[1]) {
        obj.cood = obj.cood.add(V(speed, 0));
      }
      if (Controller.states[2]) {
        obj.cood = obj.cood.add(V(0, -speed));
      }
      if (Controller.states[3]) {
        obj.cood = obj.cood.add(V(0, speed));
      }
      return onUpdate0?.call(target, obj) ?? false;
    };
  }

  /**
   * Use a camera controller
   * @param {GameObject} target - The target
   * @returns {void}
   */
  public static useCameraController(target: GameObject): void {
    const onUpdate0 = target.onUpdate;
    target.onUpdate = (obj) => {
      Game.instance.currentCamera.focus(obj.getRect().center);
      return onUpdate0?.call(target, obj) ?? false;
    };
  }
}

import Game from "..";
import { Rect, V } from "../game/utils";

/**
 * GameKeyboardEvent
 * A type to represent a game keyboard event
 */
export type GameKeyboardEvent = {
  type: "keydown" | "keyup";
  key: string;
};

/**
 * GameMouseEvent
 * A type to represent a game mouse event
 */
export type GameMouseEvent = {
  type: "mousedown" | "mouseup" | "mousemove" | "click";
  x: number;
  y: number;
};

/**
 * Events
 * A class to handle the game events
 */
export class Events {
  private keyboardEvents: GameKeyboardEvent[] = []; // Queue of keyboard events
  private mouseEvents: GameMouseEvent[] = []; // Queue of mouse events

  /**
   * Clear the events
   * @returns {void}
   */
  public clear(): void {
    this.keyboardEvents = [];
    this.mouseEvents = [];
  }

  /**
   * Push a keyboard event
   * @param {GameKeyboardEvent} event - The keyboard event
   * @returns {void}
   */
  public pushKeyboardEvent(event: GameKeyboardEvent): void {
    this.keyboardEvents.push(event);
  }

  /**
   * Push a mouse event
   * @param {GameMouseEvent} event - The mouse event
   * @returns {void}
   */
  public pushMouseEvent(event: GameMouseEvent): void {
    this.mouseEvents.push(event);
  }

  /**
   * Dispatch a keyboard event
   * @returns {void}
   */
  public dispatchKeyboardEvent(): void {
    let e = this.keyboardEvents.shift();
    e &&
      Game.instance.layers.forEach((layer) => {
        switch (e.type) {
          case "keydown":
            layer.dispatchKeyDown(e.key);
            break;
          case "keyup":
            layer.dispatchKeyUp(e.key);
            break;
        }
      });
  }

  /**
   * Dispatch a mouse event
   * @returns {void}
   */
  public dispatchMouseEvent(): void {
    let e = this.mouseEvents.shift();
    e &&
      Game.instance.layers.forEach((layer) => {
        switch (e.type) {
          case "mousedown":
            layer.dispatchMouseDown(V(e.x, e.y), V(e.x, e.y).sub(layer.cood));
            break;
          case "mouseup":
            layer.dispatchMouseUp(V(e.x, e.y), V(e.x, e.y).sub(layer.cood));
            break;
          case "mousemove":
            layer.dispatchMouseMove(V(e.x, e.y), V(e.x, e.y).sub(layer.cood));
            break;
          case "click":
            layer.dispatchClick(V(e.x, e.y), V(e.x, e.y).sub(layer.cood));
            break;
        }
      });
  }
}

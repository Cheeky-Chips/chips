import Game from "..";
import { Rect, V } from "../game/utils";

export type GameKeyboardEvent = {
  type: "keydown" | "keyup";
  key: string;
};

export type GameMouseEvent = {
  type: "mousedown" | "mouseup" | "mousemove" | "click";
  x: number;
  y: number;
};

export class Events {
  private keyboardEvents: GameKeyboardEvent[] = []; // Queue of keyboard events
  private mouseEvents: GameMouseEvent[] = []; // Queue of mouse events

  public clear(): void {
    this.keyboardEvents = [];
    this.mouseEvents = [];
  }

  public pushKeyboardEvent(event: GameKeyboardEvent): void {
    this.keyboardEvents.push(event);
  }

  public pushMouseEvent(event: GameMouseEvent): void {
    this.mouseEvents.push(event);
  }

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

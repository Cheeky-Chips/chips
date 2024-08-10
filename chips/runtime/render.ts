import { CanvasRenderingContext2D, ImageData } from "skia-canvas";
import { Canvas } from "skia-canvas";
import Game from "..";

export type RenderRecord = {
  command: string;
  x: number;
  y: number;
  width: number;
  height: number;
  arg: string;
};
export class Render {
  public record: RenderRecord[];

  constructor(width: number, height: number) {
    this.record = [];
  }

  public render(): RenderRecord[] {
    for (let object of Game.instance.layers) {
      object.onUpdate(object);
      object.renderTo(this.record);
    }
    return this.record;
  }

  public clear(): void {
    this.record = [];
  }
}

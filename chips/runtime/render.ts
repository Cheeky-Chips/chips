import { CanvasRenderingContext2D, ImageData } from "skia-canvas";
import { Canvas } from "skia-canvas";
import Game from "..";

export class Render {
  public canvas: Canvas;
  public ctx: CanvasRenderingContext2D;

  constructor() {
    let { width, height } = Game.instance.config.viewport ?? /*Never reach*/ {
      width: 800,
      height: 600,
    };
    this.canvas = new Canvas(width, height);
    this.ctx = this.canvas.getContext("2d");
  }

  public render(): ImageData {
    for (let object of Game.instance.layers) {
      object.getRender()(this.ctx);
    }
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
}

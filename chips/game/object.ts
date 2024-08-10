import Game, { GameImageData } from "..";
import { Cood, Size, Vector2D } from "./utils";
import { CanvasRenderingContext2D } from "skia-canvas";

type OnUpdateListener = (object: GameObject) => void;
type OnCreateListener = (object: GameObject) => void;

export class GameObject {
  public cood: Cood;
  public size: Size;

  public isFrozen: boolean = false;
  public isHidden: boolean = false;

  protected render: (ctx: CanvasRenderingContext2D) => void;

  constructor(cood: Cood, size: Size, layer: number = 0) {
    this.cood = cood;
    this.size = size;
    this.render = (_ctx: CanvasRenderingContext2D) => {};
  }

  public getRender() {
    return this.render;
  }

  public onCreate(listener: OnCreateListener) {
    listener(this);
  }

  public onUpdate(listener: OnUpdateListener) {
    listener(this);
  }
}

export class Sprite extends GameObject {
  private image: GameImageData;

  constructor(cood: Cood, size: Size, image: GameImageData) {
    super(cood, size);
    this.image = image;
    this.render = (ctx: CanvasRenderingContext2D) => {
      let { data_url, width, height } = this.image;
      let [dx, dy] = this.cood.t();
      let image = new Image();
      image.src = data_url;
      ctx.drawImage(image, dx, dy, width, height);
    };
  }
}

export class Color extends GameObject {
  private color: string;

  constructor(cood: Cood, size: Size, color: string) {
    super(cood, size);
    this.color = color;
    this.render = (ctx: CanvasRenderingContext2D) => {
      let [dx, dy] = this.cood.t();
      let [width, height] = this.size.t();
      ctx.fillStyle = this.color;
      ctx.fillRect(dx, dy, width, height);
    };
  }
}

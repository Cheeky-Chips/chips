import Game, { GameImageData } from "..";
import { Cood, Size, Vector2D } from "./utils";
import { CanvasRenderingContext2D } from "skia-canvas";

type OnUpdateListener = (object: GameObject) => void;
type OnCreateListener = (object: GameObject) => void;

export class GameObject {
  public _cood: Cood;
  public _size: Size;

  public _isFrozen: boolean = false;
  public _isHidden: boolean = false;

  protected render: (ctx: CanvasRenderingContext2D) => void;

  constructor(cood: Cood, size: Size, layer: number = 0) {
    this._cood = cood;
    this._size = size;
    this.render = (_ctx: CanvasRenderingContext2D) => {};
  }

  getRender() {
    return this.render;
  }

  set cood(cood: Cood) {
    this.cood = cood;
  }

  set size(size: Size) {
    this.size = size;
  }

  set isFrozen(isFrozen: boolean) {
    this._isFrozen = isFrozen;
  }

  set isHidden(isHidden: boolean) {
    this._isHidden = isHidden;
  }

  onCreate(listener: OnCreateListener) {
    listener(this);
  }

  onUpdate(listener: OnUpdateListener) {
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

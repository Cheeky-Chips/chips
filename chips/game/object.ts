import { GameImageData } from "..";
import { Cood, Size } from "./utils";
import { CanvasRenderingContext2D } from "skia-canvas";


export class GameObject {
  public cood : Cood;
  public size : Size;
  

  protected render: (ctx: CanvasRenderingContext2D) => void;
  
  constructor(cood: Cood, size: Size) {
    this.cood = cood;
    this.size = size;
    this.render = (_ctx: CanvasRenderingContext2D) => {};
  }
}


export class Sprite extends GameObject {
  private image : GameImageData;

  constructor(cood: Cood, size: Size, image: GameImageData) {
    super(cood, size);
    this.image = image;
    this.render = (ctx: CanvasRenderingContext2D) => {
      let {data_url, width, height} = this.image;
      let [dx, dy] = this.cood.t();
      let image = new Image();
      image.src = data_url;
      ctx.drawImage(image, dx, dy, width, height);
    }
  }
}
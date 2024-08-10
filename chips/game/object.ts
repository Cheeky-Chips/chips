import Game, { GameImageData } from "..";
import { RenderRecord } from "../runtime/render";
import { Cood, Size } from "./utils";
import { CanvasRenderingContext2D } from "skia-canvas";

type OnUpdateListener = (object: GameObject) => void;
type OnCreateListener = (object: GameObject) => void;

/**
 * GameObject
 * A class to represent a game object
 */
export class GameObject {
  public cood: Cood;
  public size: Size;
  public id: string;

  public isFrozen: boolean = false;
  public isHidden: boolean = false;

  public onUpdate: OnUpdateListener = (_object: GameObject) => {};
  public onCreate: OnCreateListener = (_object: GameObject) => {};

  protected render?: (ctx: RenderRecord[]) => void;

  /**
   * Create a new GameObject
   * @param {Cood} cood - The coordinate of the object
   * @param {Size} size - The size of the object
   * @param {string} id - The id of the object
   * @param {number} [layer=0] - The layer of the object
   */
  constructor(cood: Cood, size: Size, id: string, public layer: number = 0) {
    this.cood = cood;
    this.size = size;
    this.id = id;
    this.render = (_ctx: RenderRecord[]) => {};
  }

  /**
   * Load the object into the game
   * @returns {void}
   */
  public load(): void {
    Game.instance.layers[this.layer].push(this);
  }

  /**
   * Render the object to the context
   * @param {CanvasRenderingContext2D} ctx - The context to render to
   * @returns {void}
   */
  public renderTo(ctx: RenderRecord[]): void {
    if (this.render) this.render(ctx);
  }
}

/**
 * Sprite
 * A class to represent a sprite
 */
export class Sprite extends GameObject {
  private image: GameImageData;

  constructor(
    cood: Cood,
    size: Size,
    id: string,
    layer: number = 0,
    image: GameImageData
  ) {
    super(cood, size, id, layer);
    this.image = image;
    this.render = (ctx: RenderRecord[]) => {
      let { data_url, width, height } = this.image;
      let [dx, dy] = this.cood.t();
      ctx.push({
        command: "image",
        x: dx,
        y: dy,
        width: width,
        height: height,
        arg: data_url,
      });
    };
  }
}

/**
 * Color
 * A class to represent a block of color
 */
export class Color extends GameObject {
  private color: string;

  constructor(
    cood: Cood,
    size: Size,
    id: string,
    layer: number = 0,
    color: string
  ) {
    super(cood, size, id, layer);
    this.color = color;
    this.render = (ctx: RenderRecord[]) => {
      let [dx, dy] = this.cood.t();
      let [width, height] = this.size.t();
      ctx.push({
        command: "color",
        x: dx,
        y: dy,
        width: width,
        height: height,
        arg: color,
      });
    };
  }
}

import Game, { GameImageData } from "..";
import { RenderRecord } from "../runtime/render";
import { Cood, Rect, Size } from "./utils";
import { CanvasRenderingContext2D } from "skia-canvas";

export type OnUpdateListener = (object: GameObject) => boolean;
export type OnCreateListener = (object: GameObject) => boolean;

export type OnKeyListener = (object: GameObject, key: string) => boolean;

export type OnMouseListener = (
  object: GameObject,
  cood: Cood,
  relativeCood: Cood
) => boolean;

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

  public onUpdate?: OnUpdateListener;
  public onCreate?: OnCreateListener;

  public onKeyDown?: OnKeyListener;
  public onKeyUp?: OnKeyListener;

  public onMouseDown?: OnMouseListener;
  public onMouseUp?: OnMouseListener;
  public onMouseMove?: OnMouseListener;
  public onClick?: OnMouseListener;

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
  }

  /**
   * Load the object into the game
   * @returns {void}
   */
  public load(): void {
    Game.instance.layers[this.layer].push(this);
    this.onCreate?.(this);
  }

  /**
   * Get the rect of the object
   * @returns {Rect} The rect of the object
   */
  public getRect(): Rect {
    return Rect.from(this.cood, this.size);
  }

  /**
   * Render the object to the context
   * @param {CanvasRenderingContext2D} ctx - The context to render to
   * @returns {void}
   */
  public renderTo(ctx: RenderRecord[]): void {
    if (this.render) this.render(ctx);
  }

  public dispatchKeyDown(key: string): boolean {
    return this.onKeyDown?.(this, key) ?? true;
  }

  public dispatchKeyUp(key: string): boolean {
    return this.onKeyUp?.(this, key) ?? true;
  }

  public dispatchMouseDown(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseDown?.(this, cood, relativeCood) ?? true;
  }

  public dispatchMouseUp(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseUp?.(this, cood, relativeCood) ?? true;
  }

  public dispatchMouseMove(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseMove?.(this, cood, relativeCood) ?? true;
  }

  public dispatchClick(cood: Cood, relativeCood: Cood): boolean {
    return this.onClick?.(this, cood, relativeCood) ?? true;
  }

  public dispatchUpdate(): boolean {
    return this.onUpdate?.(this) ?? true;
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

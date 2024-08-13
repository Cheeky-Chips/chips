import Game, { GameImageData } from "..";
import { RenderRecord } from "../runtime/render";
import { GameAnimation } from "./animation";
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
  /**
   * The coordinate of the object
   */
  public cood: Cood;
  /**
   * The size of the object
   */
  public size: Size;
  /**
   * The id of the object
   */
  public id: string;

  /**
   * Whether the object is frozen
   */
  public isFrozen: boolean = false;

  /**
   * Whether the object is hidden
   */
  public isHidden: boolean = false;

  /**
   * Whether the object image is flipped horizontally
   */
  public flipX: boolean = false;

  /**
   * Whether the object image is flipped vertically
   */
  public flipY: boolean = false;

  /**
   * The current animation of the object
   */
  public currentAnimation: GameAnimation | null = null;

  /**
   * The listener for the update event
   */
  public onUpdate?: OnUpdateListener;

  /**
   * The listener for the create event
   */
  public onCreate?: OnCreateListener;

  /**
   * The listener for the key down event
   */
  public onKeyDown?: OnKeyListener;

  /**
   * The listener for the key up event
   */
  public onKeyUp?: OnKeyListener;

  /**
   * The listener for the mouse down event
   */
  public onMouseDown?: OnMouseListener;

  /**
   * The listener for the mouse up event
   */
  public onMouseUp?: OnMouseListener;

  /**
   * The listener for the mouse move event
   */
  public onMouseMove?: OnMouseListener;

  /**
   * The listener for the click event
   */
  public onClick?: OnMouseListener;

  /**
   * The listener for the render
   * @param {RenderRecord[]} ctx - The context to render to
   * @returns {void}
   */
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
   * Get the center of the object
   * @returns {Cood} The center of the object
   */
  public runAnimation(animation: GameAnimation): void {
    this.currentAnimation = animation;
  }

  /**
   * End the current animation
   * @returns {void}
   */
  public endAnimation(): void {
    this.currentAnimation?.endFrame();
    this.currentAnimation = null;
  }

  /**
   * Render the object to the context
   * @param {CanvasRenderingContext2D} ctx - The context to render to
   * @returns {void}
   */
  public renderTo(ctx: RenderRecord[]): void {
    if (!this.currentAnimation?.tick()) this.endAnimation();
    if (this.render) this.render(ctx);
  }

  /**
   * Dispatch a key down event
   * @param {string} key - The key that was pressed
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchKeyDown(key: string): boolean {
    return this.onKeyDown?.(this, key) ?? true;
  }

  /**
   * Dispatch a key up event
   * @param {string} key - The key that was released
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchKeyUp(key: string): boolean {
    return this.onKeyUp?.(this, key) ?? true;
  }

  /**
   * Dispatch a mouse down event
   * @param {Cood} cood - The coordinate of the mouse
   * @param {Cood} relativeCood - The coordinate of the mouse relative to the object
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchMouseDown(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseDown?.(this, cood, relativeCood) ?? true;
  }

  /**
   * Dispatch a mouse up event
   * @param {Cood} cood - The coordinate of the mouse
   * @param {Cood} relativeCood - The coordinate of the mouse relative to the object
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchMouseUp(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseUp?.(this, cood, relativeCood) ?? true;
  }

  /**
   * Dispatch a mouse move event
   * @param {Cood} cood - The coordinate of the mouse
   * @param {Cood} relativeCood - The coordinate of the mouse relative to the object
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchMouseMove(cood: Cood, relativeCood: Cood): boolean {
    return this.onMouseMove?.(this, cood, relativeCood) ?? true;
  }

  /**
   * Dispatch a click event
   * @param {Cood} cood - The coordinate of the mouse
   * @param {Cood} relativeCood - The coordinate of the mouse relative to the object
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchClick(cood: Cood, relativeCood: Cood): boolean {
    return this.onClick?.(this, cood, relativeCood) ?? true;
  }

  /**
   * Dispatch an update event
   * @returns {boolean} Whether the event is transitive
   */
  public dispatchUpdate(): boolean {
    return this.onUpdate?.(this) ?? true;
  }

  /**
   * Get the client coordinate of the object
   * @returns {Cood} The client coordinate of the object
   */
  protected getClientCood(): { x: number; y: number } {
    return {
      x: this.cood.x - Game.instance.currentCamera.cood.x,
      y: this.cood.y - Game.instance.currentCamera.cood.y,
    };
  }
}

/**
 * Sprite
 * A class to represent a sprite
 */
export class Sprite extends GameObject {
  private image: GameImageData;

  /**
   * Create a new Sprite object
   * @param {Cood} cood - The coordinate of the sprite
   * @param {Size} size - The size of the sprite
   * @param {string} id - The id of the sprite
   * @param {number} [layer=0] - The layer of the sprite
   * @param {GameImageData} image - The image of the sprite
   */
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
      ctx.push({
        command: "image",
        ...this.getClientCood(),
        width: width,
        height: height,
        arg: data_url,

        ...(this.currentAnimation?.currentRecord ?? {}),
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

  /**
   * Create a new Color object
   * @param {Cood} cood - The coordinate of the color
   * @param {Size} size - The size of the color
   * @param {string} id - The id of the color
   * @param {number} [layer=0] - The layer of the color
   * @param {string} color - The color of the color
   */
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
      let [width, height] = this.size.t();
      ctx.push({
        command: "color",
        ...this.getClientCood(),
        width: width,
        height: height,
        arg: color,

        ...(this.currentAnimation?.currentRecord ?? {}),
      });
    };
  }
}

import { CanvasRenderingContext2D } from "skia-canvas";
import { GameObject, OnKeyListener } from "./object";
import { Cood, Size } from "./utils";
import Game from "..";
import { RenderRecord } from "../runtime/render";

/**
 * ObjectGroup
 * A class to represent a group of objects
 */
export class ObjectGroup extends GameObject {
  private objects: GameObject[];

  /**
   * Create a new ObjectGroup
   * @param {Cood} cood - The coordinate of the object group
   * @param {Size} size - The size of the object group
   * @param {GameObject[]} objects - The objects in the group
   */
  constructor(
    cood: Cood,
    size: Size,
    id: string,
    public layer: number = 0,
    objects: GameObject[]
  ) {
    super(cood, size, id, layer);
    this.objects = objects;
    this.render = (ctx) => {
      for (let object of this.objects) {
        object.renderTo(ctx);
      }
    };
  }

  /**
   * Push an object to the group
   * @param {GameObject} object - The object to push
   * @returns {void}
   */
  public push(object: GameObject): void {
    this.objects.find((o) => o.id === object.id) || this.objects.push(object);
  }

  /**
   * Pop an object from the group
   * @returns {void}
   */
  public pop(): void {
    this.objects.pop();
  }

  /**
   * Get the object at an index
   * @param {number} index - The index of the object
   * @returns {GameObject} The object at the index
   * @throws {Error} If the index is out of range
   */
  public at(index: number): GameObject {
    if (index < 0 || index >= this.objects.length) {
      throw new Error("Index out of range");
    }
    return this.objects[index];
  }

  public find(id: string): GameObject | undefined {
    return this.objects.find((o) => o.id === id);
  }

  /**
   * Clear the group
   * @returns {void}
   */
  public clear(): void {
    this.objects = [];
  }

  /**
   * Render the group to the context
   * @param {CanvasRenderingContext2D} ctx - The context to render to
   * @returns {void}
   */
  public override renderTo(ctx: RenderRecord[]): void {
    for (let object of this.objects) object.renderTo(ctx);
  }

  public override dispatchKeyDown(key: string): boolean {
    let tr = this.onKeyDown?.(this, key);
    for (let object of this.objects) {
      tr && object.dispatchKeyDown(key);
    }
    return tr ?? false;
  }

  public override dispatchKeyUp(key: string): boolean {
    let tr = this.onKeyUp?.(this, key);
    for (let object of this.objects) {
      tr && object.dispatchKeyUp(key);
    }
    return tr ?? false;
  }

  public override dispatchMouseDown(cood: Cood, relativeCood: Cood): boolean {
    let tr = this.onMouseDown?.(this, cood, relativeCood);
    for (let object of this.objects) {
      tr &&
        this.getRect().contains(cood) &&
        object.dispatchMouseDown(cood, cood.sub(this.cood));
    }
    return tr ?? false;
  }

  public override dispatchMouseUp(cood: Cood, relativeCood: Cood): boolean {
    let tr = this.onMouseUp?.(this, cood, relativeCood);
    for (let object of this.objects) {
      tr &&
        this.getRect().contains(cood) &&
        object.dispatchMouseUp(cood, cood.sub(this.cood));
    }
    return tr ?? false;
  }

  public override dispatchMouseMove(cood: Cood, relativeCood: Cood): boolean {
    let tr = this.onMouseMove?.(this, cood, relativeCood);
    for (let object of this.objects) {
      tr &&
        this.getRect().contains(cood) &&
        object.dispatchMouseMove(cood, cood.sub(this.cood));
    }
    return tr ?? false;
  }

  public override dispatchClick(cood: Cood, relativeCood: Cood): boolean {
    let tr = this.onClick?.(this, cood, relativeCood);
    for (let object of this.objects) {
      console.log(
        `Mouse Event: ${tr}, ${object.cood.t()}, ${object.size.t()}, ${cood.t()}`
      );
      tr &&
        object.getRect().contains(cood) &&
        object.dispatchClick(cood, cood.sub(object.cood));
    }
    return tr ?? false;
  }

  public override dispatchUpdate(): boolean {
    let tr = this.onUpdate?.(this);
    if (tr == undefined) tr = true;
    for (let object of this.objects) {
      tr && object.dispatchUpdate();
    }
    return tr ?? true;
  }
}

import { CanvasRenderingContext2D } from "skia-canvas";
import { GameObject } from "./object";
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
}

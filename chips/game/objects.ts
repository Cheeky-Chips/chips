import { CanvasRenderingContext2D } from "skia-canvas";
import { GameObject } from "./object";
import { Cood, Size, Vector2D } from "./utils";

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
  constructor(cood: Cood, size: Size, objects: GameObject[]) {
    super(cood, size);
    this.objects = objects;
    this.render = (ctx) => {
      for (let object of this.objects) {
        object.getRender()(ctx);
      }
    };
  }

  /**
   * Push an object to the group
   * @param {GameObject} object - The object to push
   * @returns {void}
   */
  public push(object: GameObject): void {
    this.objects.push(object);
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
   */
  public at(index: number): GameObject {
    return this.objects[index];
  }

  /**
   * Clear the group
   * @returns {void}
   */
  public clear(): void {
    this.objects = [];
  }

  public override getRender(): (ctx: CanvasRenderingContext2D) => void {
    return (ctx) => {
      for (let object of this.objects) {
        object.getRender()(ctx);
      }
    };
  }
}

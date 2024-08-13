import Game from "..";

/**
 * The render record
 */
export type RenderRecord = {
  command: string;
  x: number;
  y: number;
  width: number;
  height: number;
  arg: string;
};

/**
 * Render
 * A class to handle the rendering
 */
export class Render {
  /**
   * The public record
   */
  public record: RenderRecord[];

  /**
   * Create a new Render object
   * @param {number} width - The width of the render
   * @param {number} height - The height of the render
   */
  constructor(width: number, height: number) {
    this.record = [];
  }

  /**
   * Render the objects
   * @returns {RenderRecord[]} The render record
   */
  public render(): RenderRecord[] {
    for (let object of Game.instance.layers) {
      object.dispatchUpdate();
      object.renderTo(this.record);
    }
    return this.record;
  }

  /**
   * Clear the render
   * @returns {void}
   */
  public clear(): void {
    this.record = [];
  }
}

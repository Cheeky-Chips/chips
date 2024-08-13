import { GameObject } from "./object";
import { Cood, Size } from "./utils";

/**
 * A class to represent a camera
 */
export class Camera extends GameObject {
  public focusedCood: Cood;
  public scale: number;

  /**
   * Create a new Camera
   * @param {Cood} focusedCood - The coordinate to focus on
   * @param {Size} viewSize - The size of the view
   * @param {number} scale - The scale of the view
   */
  constructor(
    focusedCood: Cood,
    viewSize: Size,
    scale: number = 1,
    id: string
  ) {
    super(focusedCood.sub(viewSize.div(2)), viewSize, id, 0);
    this.focusedCood = focusedCood;
    this.scale = scale;
  }

  /**
   * Focus the camera on a coordinate
   */
  public focus(focusedCood: Cood) {
    this.cood = focusedCood.sub(this.size.div(2));
  }
}

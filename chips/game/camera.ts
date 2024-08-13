import { GameObject } from "./object";
import { Cood, Rect, Size } from "./utils";

export class Camera extends GameObject {
  public focusedCood: Cood;
  public scale: number;

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

  public focus(focusedCood: Cood) {
    this.cood = focusedCood.sub(this.size.div(2));
  }
}

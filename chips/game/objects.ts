import { GameObject } from "./object";
import { Cood, Size, Vector2D } from "./utils";

export class ObjectGroup extends GameObject {
  private objects: GameObject[];

  constructor(cood: Cood, size: Size, objects: GameObject[]) {
    super(cood, size);
    this.objects = objects;
    this.render = (ctx) => {
      for (let object of this.objects) {
        object.getRender()(ctx);
      }
    };
  }

  push(object: GameObject) {
    this.objects.push(object);
  }

  pop() {
    this.objects.pop();
  }

  at(index: number) {
    return this.objects[index];
  }

  clear() {
    this.objects = [];
  }
}

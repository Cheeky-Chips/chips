import { RenderRecord } from "../runtime/render";
import { GameObject } from "./object";

type AnimationBeginListener = (tar: GameObject) => void;
type AnimationEndListener = (tar: GameObject) => void;
type AnimationFrameListener = (tar: RenderRecord) => void;

export class Animation {
  private clock: number = 0; // by ticks
  private tar: GameObject;

  protected records: RenderRecord[] = [];

  public interval: number = 1;
  public loop: boolean = true;

  public onBegin?: AnimationBeginListener;
  public onEnd?: AnimationEndListener;
  public onFrame?: AnimationFrameListener;

  constructor(tar: GameObject) {
    this.tar = tar;
  }

  public get count() {
    return this.records.length;
  }

  public nextFrame(): void {
    let record = this.records[this.clock % this.interval];
    this.clock += this.interval;
  }

  public endFrame(): void {
    this.onEnd?.(this.tar);
    this.clock = 0;
  }
}

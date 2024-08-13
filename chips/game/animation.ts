import { GameImageData } from "..";
import { RenderRecord } from "../runtime/render";
import { GameObject } from "./object";

type AnimationBeginListener = (tar: GameObject) => void;
type AnimationEndListener = (tar: GameObject) => void;
type AnimationFrameListener = (tar: RenderRecord) => void;

export class GameAnimation {
  private clock: number = 0; // by ticks
  private tar: GameObject;

  protected records: RenderRecord[];

  public interval: number = 1;
  public loop: boolean = true;
  public currentRecord: RenderRecord;

  public onBegin?: AnimationBeginListener;
  public onEnd?: AnimationEndListener;
  public onFrame?: AnimationFrameListener;

  constructor(tar: GameObject, records: RenderRecord[], interval: number = 1) {
    this.tar = tar;
    this.records = records;
    this.currentRecord = records[0];
    this.interval = interval;
  }

  public get count() {
    return this.records.length;
  }

  public get total() {
    return this.interval * this.count;
  }

  public tick(): boolean {
    if (this.clock == this.total) {
      this.loop ? (this.clock = 0) : this.endFrame();
      return true;
    }
    if (this.clock == 0) this.onBegin?.(this.tar);
    if (this.clock % this.interval == 0) {
      this.nextFrame();
    }
    this.clock++;
    return true;
  }

  public nextFrame(): void {
    let record = this.records[this.clock / this.interval];
    this.onFrame?.(record);
    this.currentRecord = record;
    console.log("next frame", this.clock);
  }

  public endFrame(): void {
    this.onEnd?.(this.tar);
    this.clock = 0;
  }
}

export class SpriteAnimation extends GameAnimation {
  constructor(tar: GameObject, images: GameImageData[]) {
    let records = images.map((image) => {
      return {
        command: "image",
        width: image.width,
        height: image.height,
        arg: image.data_url,
      } as RenderRecord;
    });
    super(tar, records);
  }
}

export class ColorAnimation extends GameAnimation {
  constructor(tar: GameObject, colors: string[], interval: number = 1) {
    let records = colors.map((color) => {
      return {
        command: "color",
        arg: color,
      } as RenderRecord;
    });
    super(tar, records, interval);
  }
}

import { GameImageData } from "..";
import { RenderRecord } from "../runtime/render";
import { GameObject } from "./object";

/**
 * Represents a listener function for animation begin.
 *
 * @param tar - The target GameObject object.
 */
type AnimationBeginListener = (tar: GameObject) => void;
/**
 * Represents a listener function for animation end.
 *
 * @param tar - The target GameObject object.
 */
type AnimationEndListener = (tar: GameObject) => void;
/**
 * Represents a listener function for animation frames.
 *
 * @param tar - The target RenderRecord object.
 */
type AnimationFrameListener = (tar: RenderRecord) => void;

/**
 * Represents a game animation.
 */
export class GameAnimation {
  private clock: number = 0; // by ticks
  private tar: GameObject;

  protected records: RenderRecord[];

  /**
   * The interval of the animation.
   */
  public interval: number = 1;
  /**
   * Whether the animation should loop.
   */
  public loop: boolean = true;
  /**
   * The current record of the animation.
   */
  public currentRecord: RenderRecord;
  /**
   * The begin listener of the animation.
   */
  public onBegin?: AnimationBeginListener;
  /**
   * The end listener of the animation.
   */
  public onEnd?: AnimationEndListener;
  /**
   * The frame listener of the animation.
   */
  public onFrame?: AnimationFrameListener;

  /**
   * Create a new GameAnimation.
   *
   * @param tar - The target GameObject object.
   * @param records - The records of the animation.
   * @param interval - The interval of the animation.
   */
  constructor(tar: GameObject, records: RenderRecord[], interval: number = 1) {
    this.tar = tar;
    this.records = records;
    this.currentRecord = records[0];
    this.interval = interval;
  }

  /**
   * The frame count of the animation.
   */
  public get count() {
    return this.records.length;
  }

  /**
   * The total duration of the animation.
   */
  public get total() {
    return this.interval * this.count;
  }

  /**
   * Play one tick of the animation.
   */
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

  /**
   * Play the next frame of the animation.
   */
  public nextFrame(): void {
    let record = this.records[this.clock / this.interval];
    this.onFrame?.(record);
    this.currentRecord = record;
    console.log("next frame", this.clock);
  }

  /**
   * End the animation.
   */
  public endFrame(): void {
    this.onEnd?.(this.tar);
    this.clock = 0;
  }
}

/**
 * Represents a sprite animation.
 */
export class SpriteAnimation extends GameAnimation {
  /**
   * Create a new SpriteAnimation.
   * @param tar - The target GameObject object.
   * @param images - The images of the animation.
   * @param interval - The interval of the animation.
   */
  constructor(tar: GameObject, images: GameImageData[], interval: number = 1) {
    let records = images.map((image) => {
      return {
        command: "image",
        width: image.width,
        height: image.height,
        arg: image.data_url,
      } as RenderRecord;
    });
    super(tar, records, interval);
  }
}

export class ColorAnimation extends GameAnimation {
  /**
   * Create a new ColorAnimation.
   * @param tar - The target GameObject object.
   * @param colors - The colors of the animation.
   * @param interval - The interval of the animation.
   */
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

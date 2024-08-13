import express from "express";
import fs from "fs";
import RenderServer from "./runtime/route";
import sizeOf from "buffer-image-size";
import { ObjectGroup } from "./game/objects";
import { Vector2D } from "./game/utils";
import { GameObject } from "./game/object";
import { Events } from "./runtime/events";

/**
 * GameConfig
 * A type to represent the game configuration
 */
export type GameConfig = {
  name: string;
  fps?: number;
  port?: number;
  asset_path?: string;
  viewport?: {
    width: number;
    height: number;
  };
};

/**
 * GameHandler
 * A class to handle the game
 */
export interface GameHandler {
  onConfig(): GameConfig;
  onLoad(loader: ResourceLoader): void;
  onUpdate(): void;
  onEnd(): void;
}

/**
 * Game
 * A class to represent the game
 */
export default class Game {
  // The game configuration

  public static instance: Game;

  public config: GameConfig;

  private handler: GameHandler;
  private loader: ResourceLoader;
  private server: RenderServer;
  private events: Events;

  public layers: ObjectGroup[];

  constructor(handler: GameHandler) {
    this.config = handler.onConfig();
    this.handler = handler;
    this.loader = new ResourceLoader();
    this.server = new RenderServer();
    this.events = new Events();
    this.layers = Array.from({ length: 4 }, () => {
      let g = new ObjectGroup(
        new Vector2D(0, 0),
        new Vector2D(0, 0),
        "_layer",
        0,
        []
      );
      g.onClick = (_obj, _cood, _rCood) => true;
      g.onMouseUp = (_obj, _cood, _rCood) => true;
      g.onMouseDown = (_obj, _cood, _rCood) => true;
      g.onMouseMove = (_obj, _cood, _rCood) => true;
      g.onKeyDown = (_obj, _key) => true;
      g.onKeyUp = (_obj, _key) => true;
      return g;
    });
  }

  /**
   * Launch the game
   * @returns void
   */
  public launch() {
    const config = this.handler.onConfig();
    //this.loader.loadImageFromPath(config.asset_path ?? "assets" + "/images");
    Game.instance = this;
    this.handler.onLoad(this.loader);
    this.server.start(config.port ?? 3000);
  }

  public getHandler() {
    return this.handler;
  }

  public getResourceLoader() {
    return this.loader;
  }

  public getEvents() {
    return this.events;
  }

  public pushObject(layer: number, object: GameObject) {
    if (layer < 0 || layer >= this.layers.length) {
      throw new Error("Invalid layer index");
    }
    this.layers[layer].push(object);
  }
}

export type GameImageData = {
  name: string;
  path: string;
  data_url: string;
  width: number;
  height: number;

  // Clip
  sx?: number;
};

export class ResourceLoader {
  private image_data: GameImageData[];

  constructor() {
    this.image_data = [];
  }

  public loadImageFromPath(path: string) {
    const files = fs.readdirSync(path);
    files.forEach((file: string) => {
      const buffer = fs.readFileSync(`${path}/${file}`);
      const data: GameImageData = {
        name: file,
        path: `${path}/${file}`,
        data_url: URL.createObjectURL(
          new Blob([buffer], { type: "image/png" })
        ),
        ...sizeOf(buffer),
      };
      this.image_data.push(data);
    });
  }

  public get(name: string) {
    return this.image_data.find((data) => data.name === name);
  }
}

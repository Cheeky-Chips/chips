import express from 'express';
import fs from 'fs';
import RenderServer from './runtime/route';
import sizeOf from 'buffer-image-size';

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
  }
}

/**
 * GameHandler
 * A class to handle the game
 */
export interface GameHandler {
  onConfig(): GameConfig;
  onLoad(loader: ResourceLoader): void;
  onEnd(): void;
}

/**
 * Game
 * A class to represent the game
 */
export default class Game { 

  // The game configuration
  public config: GameConfig;

  private app: express.Application;
  private handler: GameHandler;
  private loader: ResourceLoader;
  private server: RenderServer;

  constructor(handler: GameHandler) {
    this.config = handler.onConfig();
    this.app = express();
    this.handler = handler;
    this.loader = new ResourceLoader();
    this.server = new RenderServer();
  }

  /**
   * Launch the game
   * @returns void
   */
  launch() {
    const config = this.handler.onConfig();
    this.loader.loadImageFromPath(config.asset_path ?? "assets" + '/images');
    this.handler.onLoad(this.loader);
    this.server.setOnGetCallback((req, res) => {

    })
    this.server.start(config.port ?? 3000);
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
}

export class ResourceLoader {
  private image_data: GameImageData[];

  constructor() {
    this.image_data = [];
  }

  loadImageFromPath(path: string) {
    const files = fs.readdirSync(path);
    files.forEach((file: string) => {
      const buffer = fs.readFileSync(`${path}/${file}`);
      const data: GameImageData = {
        name: file,
        path: `${path}/${file}`,
        data_url: URL.createObjectURL(new Blob([buffer], {type: 'image/png'})),
        ... sizeOf(buffer)
      };
      this.image_data.push(data);
    });
  }

  get(name: string) {
    return this.image_data.find((data) => data.name === name);
  }

}
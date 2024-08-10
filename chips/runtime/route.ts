import express from "express";
import path from "path";
import Game from "..";
import { Render } from "./render";

/**
 * RenderServer
 * A class to render the server
 */
export default class RenderServer {
  private app: express.Application;
  private render?: Render;
  private runtime?: NodeJS.Timeout;
  private running: boolean = false;

  constructor() {
    const p = path.join(__dirname, "public");
    this.app = express();
    this.app.use(express.static(p));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  /**
   * Start the server
   * @returns void
   */
  public start(port: number) {
    this.app.post("/api", (req, res) => {
      if (req.body === undefined) {
        res.sendStatus(500);
        return;
      }
      if (this.running) {
        console.log("Server is already running");
        res.sendStatus(423);
        return;
      }
      const data = req.body;

      switch (data.type) {
        case "load_over":
          Game.instance.config.viewport = {
            width: data.canvas_width,
            height: data.canvas_height,
          };
          this.render = new Render(data.canvas_width, data.canvas_height);
          this.render.clear();
          res.sendStatus(200);
          break;
        case "page_close":
          clearInterval(this.runtime!);
          res.sendStatus(200);
          break;
      }
      Game.instance.getHandler().onLoad(Game.instance.getResourceLoader());
    });

    this.app.get("/update-api", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      if (this.running) {
        res.end();
        return;
      }
      this.running = true;
      this.runtime = setInterval(() => {
        Game.instance.getHandler().onUpdate();
        res.write(
          `data: ${JSON.stringify({
            type: "update",
            body: this.render?.render(),
          })}\n\n`
        );
        this.render?.clear();
      }, 1000 / (Game.instance.config.fps ?? 60));

      req.on("close", () => {
        this.running = false;
        clearInterval(this.runtime);
        this.render?.clear();
      });
    });

    this.app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  }

  public setOnGetCallback(
    callback: (req: express.Request, res: express.Response) => void
  ) {
    this.app.get("/", callback);
  }

  /**
   * Get the express application
   * @returns express.Application
   */
  public getApp() {
    return this.app;
  }
}

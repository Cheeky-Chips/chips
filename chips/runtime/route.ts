import express from "express";
import path from "path";
import Game from "..";

/**
 * RenderServer
 * A class to render the server
 */
export default class RenderServer {
  private app: express.Application;

  constructor() {
    const p = path.join(__dirname, "public");
    console.log(p);
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
      console.log(req.body);
      const data = req.body;

      if (data.type === "load_over") {
        Game.instance.config.viewport = {
          width: data.canvas_width,
          height: data.canvas_height,
        };
        res.sendStatus(200);
      }
    });

    this.app.get("/update-api", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const interval = setInterval(() => {
        Game.instance.getHandler().onUpdate();
        res.write(
          `data: ${JSON.stringify({
            type: "update",
            body: "Update Success",
          })}\n\n`
        );
      }, 1000 / (Game.instance.config.fps ?? 60));

      req.on("close", () => {
        clearInterval(interval);
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

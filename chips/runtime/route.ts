import express from 'express';

/**
 * RenderServer
 * A class to render the server
 */
export default class RenderServer {
  
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  /**
   * Start the server
   * @returns void
   */
  public start(port: number) {
    this.app.get('/', (req, res) => {
      
    });

    this.app.listen(port, () => {
      console.log('Server is running on port ' + port);
    });

    // Hooks for the server
    this.app.get('/onClick', (req, res) => {
      console.log('GET request');
    });
  }

  public setOnGetCallback(callback: (req: express.Request, res: express.Response) => void) {
    this.app.get('/', callback);
  }

  /**
   * Get the express application
   * @returns express.Application
    */
  public getApp() {
    return this.app;
  }

}
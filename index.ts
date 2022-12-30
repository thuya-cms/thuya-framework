import express, { Router } from 'express';
import http from 'http';
import IModule from './module';

class ThuyaApp {
    private _expressApp: express.Application;
    private _port: String = "8080";
    private _expressServer?: http.Server;



    constructor() {
        this._expressApp = express();
        this._expressServer = undefined;
    }



    /**
     * Start the Thuya CMS application.
     * 
     * @throws Will thow an exception if the app is already running.
     */
    public start(): void {
        if (this._expressServer)
            throw new Error("App is already running.");

        this._expressServer = this._expressApp.listen(this._port, () => {
            console.debug(`Thuya application started on port ${this._port}`);
        });
    }

    /**
     * Stop the Thuya CMS application.
     * 
     * @throws Will thow an exception if the app is not running.
     */
    public stop(): void {
        if (!this._expressServer) 
            throw new Error("App is not running.");

        this._expressServer.close();
    }

    /**
     * Adds a module for use to the Thuya application.
     * 
     * @param module the module to use
     */
    public use(module: IModule): void {
        this._expressApp.use("/", module.router);
    }
}

export default new ThuyaApp();

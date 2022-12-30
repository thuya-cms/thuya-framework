import express from 'express';
import http from 'http';

class ThuyaApp {
    private static _instance: ThuyaApp;
    
    private _expressApp: express.Application;
    private _port: String = "8080";
    private _expressServer?: http.Server;


    public static getInstance(): ThuyaApp {
        if (!this._instance)
            this._instance = new ThuyaApp();

        return this._instance;
    }


    private constructor() {
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
}

export default ThuyaApp;

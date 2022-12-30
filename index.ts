import express, { Router } from 'express';
import http from 'http';
import contentManager from './content/content-manager';
import IModule from './module';

class ThuyaApp {
    private _expressApp: express.Application;
    private _port: String = "8080";
    private _expressServer?: http.Server;
    private _modules: IModule[];


    constructor() {
        this._expressApp = express();
        this._expressServer = undefined;
        this._modules = [];
    }



    /**
     * Start the Thuya CMS application.
     * 
     * @throws will thow an exception if the app is already running
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
     * @throws will thow an exception if the app is not running
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
     * @throws will throw an exception if a module with the same id is already in use
     */
    public use(module: IModule): void {
        console.debug(`Using module: ${module.id}`);

        if (this._modules.find(existingModule => module.id === existingModule.id)) 
            throw new Error(`Module with id ${module.id} is already in use.`);

        this.importContentTypes(module);
        this._modules.push(module);
    }


    private importContentTypes(module: IModule) {
        if (module.contentTypes) {
            module.contentTypes.forEach(contentType => {
                console.debug(`Register content type: ${contentType.id}`);

                this._expressApp.get("/" + contentType.id, (req, res) => {
                    res.json(contentManager.list(contentType));
                });

                this._expressApp.get("/" + contentType.id + "/:id", (req, res) => {
                    res.json(contentManager.get(contentType, req.params["id"]));
                });
            });
        }
    }
}

export default new ThuyaApp();

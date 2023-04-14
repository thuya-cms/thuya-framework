import express, { Router } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import factory from './factory';
import IPersistency from './persistency/persistency.interface';
import IModule from './module';

class ThuyaApp {
    private _expressApp: express.Application;
    private _port: string = process.env.PORT || "8080";
    private _expressServer?: http.Server;

    

    constructor() {
        this._expressApp = express();
        this._expressApp.use(bodyParser.json());	
		this._expressApp.use(bodyParser.urlencoded({ extended: false }));

        this._expressServer = undefined;
    }



    /**
     * Load content types and start the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is already running
     * @throws will throw an exception if there is no persistency implementation set
     */
    public start(): void {
        if (this._expressServer)
            throw new Error("App is already running.");

        // Check if persistency is registered.
        factory.getContentTypePersistency();

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
     * Use a persistency implementation.
     *
     * @param persistency the persistency implementation
     * @throws will throw an exception of there is already a persistency implementation set
     */
    public usePersistency(persistency: IPersistency): void {
        factory.setPersistency(persistency);
    }

    /**
     * Import a module.
     * 
     * @param module the module to import
     */
    public useModule(module: IModule) {
        module.getContentTypes().forEach(contentType => {

        });

        this.applyControllers(module);
    }


    private applyControllers(module: IModule) {
        module.getControllers().forEach(controller => {
            this._expressApp.use(controller.getRouter());
        });
    }
}

export default new ThuyaApp();

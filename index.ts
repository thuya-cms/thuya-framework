import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import mung from 'express-mung';
import contentManager from './content/content-manager';
import factory from './factory';
import IModule from './module';
import IPersistency from './persistency/persistency';
import { of as contentItemOf } from './content/content-item';
import IContentType, { ContentTypeMiddlewareEvent } from './content/content-type';

class ThuyaApp {
    private _expressApp: express.Application;
    private _port: String = "8080";
    private _expressServer?: http.Server;
    private _modules: IModule[];

    

    constructor() {
        this._expressApp = express();
        this._expressApp.use(bodyParser.json());	
		this._expressApp.use(bodyParser.urlencoded({ extended: false }));

        this._expressServer = undefined;
        this._modules = [];
    }



    /**
     * Start the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is already running
     * @throws will throw an exception if there is no persistency implementation set
     */
    public start(): void {
        if (this._expressServer)
            throw new Error("App is already running.");

        // Check if persistency is registered.
        factory.getPersistency();

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
    public useModule(module: IModule): void {
        console.debug(`Using module: ${module.id}`);

        if (this._modules.find(existingModule => module.id === existingModule.id)) 
            throw new Error(`Module with id ${module.id} is already in use.`);

        this.importContentTypes(module);
        this._modules.push(module);
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


    private importContentTypes(module: IModule) {
        if (module.contentTypes) {
            module.contentTypes.forEach(contentType => {
                console.debug(`Register content type: ${contentType.id}`);

                this.registerBeforeMiddlewares(contentType);
                this.registerAfterMiddlewares(contentType);
                this.registerRESTMethods(contentType);
            });
        }
    }

    private registerBeforeMiddlewares(contentType: IContentType): void {
        if (!contentType.middlewares || !contentType.middlewares.before) return;
        
        contentType.middlewares.before.forEach(middleware => {
            switch (middleware.event) {
                case ContentTypeMiddlewareEvent.list:
                    this._expressApp.get("/" + contentType.id, (req, res, next) => {
                        middleware.function(req, res, next);
                    });
                    break;
                case ContentTypeMiddlewareEvent.get:
                    this._expressApp.get("/" + contentType.id + "/:id", (req, res, next) => {
                        middleware.function(req, res, next);
                    });
                    break;
                case ContentTypeMiddlewareEvent.create:
                    this._expressApp.post("/" + contentType.id, (req, res, next) => {
                        middleware.function(req, res, next);
                    });
                    break;
                default:
                    throw new Error("Unknown middleware event.");
            }
        });
    }
    
    private registerAfterMiddlewares(contentType: IContentType): void {
        if (!contentType.middlewares || !contentType.middlewares.after) return;
        
        contentType.middlewares.after.forEach(middleware => {
            switch (middleware.event) {
                case ContentTypeMiddlewareEvent.list:
                    this._expressApp.get("/" + contentType.id, mung.json((body, req, res) => {
                        middleware.function(body, req, res);
                    }));
                    break;
                case ContentTypeMiddlewareEvent.get:
                    this._expressApp.get("/" + contentType.id + "/:id", mung.json((body, req, res) => {
                        middleware.function(body, req, res);
                    }));
                    break;
                case ContentTypeMiddlewareEvent.create:
                    this._expressApp.post("/" + contentType.id, mung.json((body, req, res) => {
                        middleware.function(body, req, res);
                    }));
                    break;
                default:
                    throw new Error("Unknown middleware event.");
            }
        });
    }

    private registerRESTMethods(contentType: IContentType): void {
        this._expressApp.get("/" + contentType.id, (req, res) => {
            let data: any = [];

            contentManager.list(contentType).forEach(contentItem => {
                data.push({ id: contentItem.id, ...contentItem.getData() });
            });

            res.json(data);
        });

        this._expressApp.get("/" + contentType.id + "/:id", (req, res) => {
            let data = contentManager.get(contentType, req.params["id"]);

            res.json({
                id: req.params["id"],
                ...data.getData()
            });
        });

        this._expressApp.post("/" + contentType.id, (req, res) => {
            contentManager.create(contentType, contentItemOf(req.body));
            res.status(201);
        });
    }
}

export default new ThuyaApp();

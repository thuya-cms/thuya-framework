import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import logger from './util/logger';
import ContentProvider from './content-provider';
import { ContentDefinition } from './content-management/domain/entity/content-definition';
import expressContentManager from './content-management/app/express-content-manager';
import contentDefinitionManager from './content-management/app/content-definition-manager';

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

        this._expressServer = this._expressApp.listen(this._port, () => {
            logger.debug(`Thuya application started on port ${this._port}`);
        });
    }

    /**
     * Stop the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is not running
     */
    public stop(): void {
        if (!this._expressServer) 
            throw new Error("App is not running.");

        this._expressServer.close();
    }

    /**
     * Add a new content provider to the application.
     * 
     * @param contentProvider the content provider to add
     */
    public addContentProvider(contentProvider: ContentProvider) {
        contentProvider.getContentDefinitions().forEach(contentDefinition => {
            this.registerContentDefinition(contentDefinition);
        });
    }


    private registerContentDefinition(contentDefinition: ContentDefinition<any>) {
        contentDefinitionManager.createContentDefinition(contentDefinition);

        this._expressApp.get("/" + contentDefinition.getName(), expressContentManager.listAllContent.bind(expressContentManager));
        this._expressApp.get("/" + contentDefinition.getName() + "/:id", expressContentManager.readContent.bind(expressContentManager));
        this._expressApp.post("/" + contentDefinition.getName(), expressContentManager.createContent.bind(expressContentManager));
        this._expressApp.delete("/" + contentDefinition.getName() + "/:id", expressContentManager.deleteContent.bind(expressContentManager));
    }
}

export default new ThuyaApp();

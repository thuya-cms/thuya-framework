import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import logger from './common/utility/logger';
import ContentProvider from './content-management/app/content-provider';
import expressContentManager from './content-management/app/express-content-manager';
import contentDefinitionManager from './content-management/app/content-definition-manager';
import Module from './module';
import ContentDefinitionDTO from './content-management/app/dto/content-definition';
import dotenv from "dotenv";
import TextContentFieldDefinitionDTO from './content-management/app/dto/content-field-definition/text-content-field-definition';
import IContentDefinitionPersistency from './content-management/persistency/content-definition-persistency.interface';
import factory from './content-management/domain/factory';
import { IContentPersistency } from './content-management/domain';
import correlator from 'express-correlation-id';

class ThuyaApp {
    private _expressApp: express.Application;
    private _port: string = process.env.PORT || "8080";
    private _expressServer?: http.Server;

    

    constructor() {
        dotenv.config();

        logger.initializeLogLevel();

        this._expressApp = express();
        this._expressApp.use(correlator());
        this._expressApp.use(bodyParser.json());	
		this._expressApp.use(bodyParser.urlencoded({ extended: false }));

        this._expressServer = undefined;
        
        contentDefinitionManager.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));
    }



    /**
     * Load content types and start the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is already running
     * @throws will throw an exception if there is no persistency implementation set
     */
    public start(): void {
        logger.debug(`Starting Thuya application.`);

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
        logger.debug(`Stopping Thuya application.`);

        if (!this._expressServer) 
            throw new Error("App is not running.");

        this._expressServer.close();
    }

    public async useModule(module: Module): Promise<void> {
        logger.debug(`Using module "%s".`, module.getMetadata().name);

        module.setupMiddlewares(this._expressApp);
        
        logger.debug(`Using controllers of module "%s".`, module.getMetadata().name);
        for (const controller of module.getControllers()) 
            this._expressApp.use(controller.getRouter())

        logger.debug(`Using content providers of module "%s".`, module.getMetadata().name);
        for (const contentProvider of module.getContentProviders()) 
            await this.useContentProvider(contentProvider);
    }

    public useContentDefinitionPersistency(persistency: IContentDefinitionPersistency) {
        factory.setContentDefinitionPersistency(persistency);
    }
    
    public useContentPersistency(persistency: IContentPersistency) {
        factory.setContentPersistency(persistency);
    }


    private async useContentProvider(contentProvider: ContentProvider) {
        logger.debug(`Creating content field definitions.`);
        for (const contentFieldDefinition of contentProvider.getContentFieldDefinitions()) {
            contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
        }

        logger.debug(`Creating content definitions.`);
        for (const contentDefinition of contentProvider.getContentDefinitions()) {
            this.registerContentDefinition(contentDefinition);
        }

        logger.debug(`Creating content.`);
        await contentProvider.createContent();
    }

    private registerContentDefinition(contentDefinition: ContentDefinitionDTO) {
        contentDefinitionManager.createContentDefinition(contentDefinition);

        this._expressApp.get("/" + contentDefinition.getName(), expressContentManager.listContent.bind(expressContentManager));
        this._expressApp.get("/" + contentDefinition.getName() + "/:id", expressContentManager.readContent.bind(expressContentManager));
        this._expressApp.post("/" + contentDefinition.getName(), expressContentManager.createContent.bind(expressContentManager));
        this._expressApp.delete("/" + contentDefinition.getName() + "/:id", expressContentManager.deleteContent.bind(expressContentManager));
        this._expressApp.patch("/" + contentDefinition.getName(), expressContentManager.updateContent.bind(expressContentManager));
    }
}

export default new ThuyaApp();

import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import http from 'http';
import ContentProvider from './content-management/app/content-provider';
import expressContentManager from './content-management/app/express-content-manager';
import contentDefinitionManager from './content-management/app/content-definition-manager';
import Module from './module';
import ContentDefinitionDTO from './content-management/app/dto/content-definition/content-definition';
import dotenv from "dotenv";
import IContentDefinitionPersistency from './content-management/persistency/content-definition-persistency.interface';
import factory from './content-management/domain/factory';
import correlator from 'express-correlation-id';
import frameworkSettingsContentDefinition from './content/framework-settings-content-definition';
import frameworkSettingsContentProvider from './content/framework-settings-content-provider';
import { IContentPersistency } from './content-management/persistency';
import Logger from './common/utility/logger';
import { contentManager } from './content-management/app';

/**
 * Main entry point for a Thuya CMS application.
 */
class ThuyaApp {
    private _expressApp: express.Application;
    private _port: string = process.env.PORT || "8080";
    private _expressServer?: http.Server;
    private _frameworkSettings: any;
    private logger: Logger;
    


    constructor() {
        dotenv.config();

        Logger.initializeLogLevel();
        this.logger = Logger.for(ThuyaApp.name);

        this._expressApp = express();
        this._expressApp.use(cors());
        this._expressApp.use(correlator());
        this._expressApp.use(bodyParser.json());	
		this._expressApp.use(bodyParser.urlencoded({ extended: false }));

        this._expressServer = undefined;
    }


    /**
     * Initialize the Thuya CMS application.
     * 
     * @throws will throw an exception if framework settings cannot be read
     * @async
     */
    public async initialize(): Promise<void> {
        this.logger.debug("Initializing framework...");

        const frameworkSettingsContentDefinitionResult = await contentDefinitionManager.readContentDefinitionByName(frameworkSettingsContentDefinition.getName());
        if (frameworkSettingsContentDefinitionResult.getIsFailing()) {
            this.logger.debug("Framework not yet initialized. Starting initialization.");
            await this.useContentProvider(frameworkSettingsContentProvider);
        } else {
            this.logger.debug(`Framework is already initialized.`);
            
            const listFrameworkSettingsResult = await contentManager.listContent(frameworkSettingsContentDefinition.getName());
            if (listFrameworkSettingsResult.getIsFailing()) {
                this.logger.error(listFrameworkSettingsResult.getMessage());
                throw new Error("Failed to get framework settings.");
            }

            this._frameworkSettings = listFrameworkSettingsResult.getResult()![0];
        }

        this.logger.debug("...Framework initialization complete.");
    }

    /**
     * Load content types and start the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is already running
     */
    public start(): void {
        this.logger.debug(`Starting Thuya application...`);

        if (this._expressServer)
            throw new Error("App is already running.");

        this._expressServer = this._expressApp.listen(this._port, () => {
            this.logger.debug(`...Thuya application started on port ${this._port}.`);
        });
    }

    /**
     * Stop the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is not running
     */
    public stop(): void {
        this.logger.debug(`Stopping Thuya application...`);

        if (!this._expressServer) 
            throw new Error("App is not running.");

        this._expressServer.close();

        this.logger.debug(`...Thuya application stopped.`);
    }

    /**
     * Use a module in the Thuya CMS application.
     * 
     * @param module the module to use
     * @async
     */
    public async useModule(module: Module): Promise<void> {
        this.logger.debug(`Using module "%s"...`, module.getMetadata().name);
        
        this.logger.debug(`Using controllers of module "%s".`, module.getMetadata().name);
        for (const controller of module.getControllers()) 
            this._expressApp.use(controller.getRouter())

        this.logger.debug(`Using content providers of module "%s".`, module.getMetadata().name);
        for (const contentProvider of module.getContentProviders()) 
            await this.useContentProvider(contentProvider);

        this.logger.debug(`...Module "%s" is successfully used.`, module.getMetadata().name);
    }

    /**
     * Use a content definition persistency.
     * 
     * @param persistency the persistency to use
     */
    public useContentDefinitionPersistency(persistency: IContentDefinitionPersistency): void {
        factory.setContentDefinitionPersistency(persistency);
    }
    
    /**
     * Use a content persistency.
     * 
     * @param persistency the persistency to use
     */
    public useContentPersistency(persistency: IContentPersistency): void {
        factory.setContentPersistency(persistency);
    }


    private async useContentProvider(contentProvider: ContentProvider): Promise<void> {
        if (!this._frameworkSettings) {
            this.logger.debug(`Creating content field definitions.`);
            for (const contentFieldDefinition of contentProvider.getContentFieldDefinitions()) {
                await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
            }
            
            this.logger.debug(`Creating content definitions.`);
            for (const contentDefinition of contentProvider.getContentDefinitions()) {
                await contentDefinitionManager.createContentDefinition(contentDefinition);
            }
            
            this.logger.debug(`Creating content.`);
            await contentProvider.createContent();
        }   
        
        this.logger.debug(`Registering content definitions.`);
        for (const contentDefinition of contentProvider.getContentDefinitions()) {
            this.registerContentDefinition(contentDefinition);
        }
    }

    private registerContentDefinition(contentDefinition: ContentDefinitionDTO): void {
        this._expressApp.get("/" + contentDefinition.getName(), expressContentManager.listContent.bind(expressContentManager));
        this._expressApp.get("/" + contentDefinition.getName() + "/:id", expressContentManager.readContent.bind(expressContentManager));
        this._expressApp.post("/" + contentDefinition.getName(), expressContentManager.createContent.bind(expressContentManager));
        this._expressApp.delete("/" + contentDefinition.getName() + "/:id", expressContentManager.deleteContent.bind(expressContentManager));
        this._expressApp.patch("/" + contentDefinition.getName(), expressContentManager.updateContent.bind(expressContentManager));
    }
}

export default new ThuyaApp();

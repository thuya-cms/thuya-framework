import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import http from 'http';
import ContentProvider, { MigrationOperation } from './content-management/app/content-provider';
import expressContentManager from './content-management/app/express-content-manager';
import contentDefinitionManager from './content-management/app/content-definition-manager';
import Module, { ModuleMetadata } from './module';
import ContentDefinitionDTO from './content-management/app/dto/content-definition/content-definition';
import dotenv from "dotenv";
import IContentDefinitionPersistency from './content-management/persistency/content-definition-persistency.interface';
import factory from './content-management/domain/factory';
import correlator from 'express-correlation-id';
import frameworkSettingsContentDefinition from './content/module-metadata-content-definition';
import frameworkSettingsContentProvider from './content/framework-content-provider';
import { IContentPersistency } from './content-management/persistency';
import Logger from './common/utility/logger';
import { contentManager } from './content-management/app';
import expressContentDefinitionController from './content-management/app/content-definition/express-content-definition.controller';
import expressContentFieldDefinitionController from './content-management/app/content-field-definition/express-content-field-definition.controller';
import moduleMetadataContentDefinition from './content/module-metadata-content-definition';
import frameworkContentProvider from './content/framework-content-provider';

/**
 * Main entry point for a Thuya CMS application.
 */
class ThuyaApp {
    private _expressApp: express.Application;
    private _port: string = process.env.PORT || "8080";
    private _expressServer?: http.Server;
    private logger: Logger;
    


    constructor() {
        dotenv.config();

        Logger.initializeLogLevel();
        this.logger = Logger.for(ThuyaApp.name);
        
        this._expressServer = undefined;
        this._expressApp = express();

        this._expressApp.use(cors());
        this._expressApp.use(correlator());
        this._expressApp.use(bodyParser.json());	
		this._expressApp.use(bodyParser.urlencoded({ extended: false }));

        this._expressApp.use(expressContentDefinitionController.getRouter());
        this._expressApp.use(expressContentFieldDefinitionController.getRouter());
    }


    /**
     * Initialize the Thuya CMS application.
     * 
     * @throws will throw an exception if framework settings cannot be read
     * @async
     */
    public async initialize(): Promise<void> {
        this.logger.debug("Initializing framework...");

        const readModuleMetadataContentDefinitionResult = await contentDefinitionManager.readContentDefinitionByName(moduleMetadataContentDefinition.getName());
        if (readModuleMetadataContentDefinitionResult.getIsFailing()) {
            this.logger.debug("Framework not yet initialized. Starting initialization.");
            await this.useContentProvider(frameworkContentProvider, { name: "framework", version: 1 });
        } 

        this.logger.debug("...Framework initialization complete.");
    }

    /**
     * Load content types and start the Thuya CMS application.
     * 
     * @throws will throw an exception if the app is already running
     */
    public start(): void {
        if (this._expressServer)
            throw new Error("App is already running.");

        this._expressServer = this._expressApp.listen(this._port, () => {
            this.logger.info(`Thuya application started on port ${this._port}.`);
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
            await this.useContentProvider(contentProvider, module.getMetadata());

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


    private async useContentProvider(contentProvider: ContentProvider, moduleMetadata: ModuleMetadata): Promise<void> {
        let actualModuleVersion = moduleMetadata.version;
        const readActualModuleVersionResult = await contentManager.readContentByFieldValue("module-version", { name: "module", value: moduleMetadata.name });
        if (readActualModuleVersionResult.getIsSuccessful()) {
            actualModuleVersion = readActualModuleVersionResult.getResult()!.version;
            await this.executeMigrations(contentProvider, actualModuleVersion);
        } else {
            this.logger.debug(`Creating content field definitions.`);
            for (const contentFieldDefinition of contentProvider.getContentFieldDefinitions()) {
                await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
            }
            
            this.logger.debug(`Creating content definitions.`);
            for (const contentDefinition of contentProvider.getContentDefinitions()) {
                await contentDefinitionManager.createContentDefinition(contentDefinition);
            }
            
            this.logger.debug(`Creating content.`);
            const initialContents = await contentProvider.getInitialContent();
            for (const initialContent of initialContents) {
                await contentManager.createContent(initialContent.contentDefinitionName, initialContent.content);
            } 
        }

        this.logger.debug(`Registering content definitions.`);
        for (const contentDefinition of contentProvider.getContentDefinitions()) {
            this.registerContentDefinition(contentDefinition);
        }

        if (actualModuleVersion === moduleMetadata.version) {
            const createModuleMetadataResult = await contentManager.createContent(moduleMetadataContentDefinition.getName(), { module: moduleMetadata.name, version: moduleMetadata.version });
            if (createModuleMetadataResult.getIsFailing()) {
                this.logger.error("Failed to create module metadata.");
                throw new Error("Failed to create module metadata.");
            }
        } else {
            const updateModuleMetadataResult = await contentManager.updateContent(moduleMetadataContentDefinition.getName(), { 
                id: readActualModuleVersionResult.getResult()!.id, 
                module: moduleMetadata.name, 
                version: moduleMetadata.version });
            if (updateModuleMetadataResult.getIsFailing()) {
                this.logger.error("Failed to update module metadata.");
                throw new Error("Failed to update module metadata.");
            }
        }
    }

    private async executeMigrations(contentProvider: ContentProvider, moduleVersion: number): Promise<void> {
        await this.executeContentFieldDefinitionMigrations(contentProvider, moduleVersion);
        await this.executeContentDefinitionMigrations(contentProvider, moduleVersion);
        await this.executeContentMigrations(contentProvider, moduleVersion);
    }

    private async executeContentFieldDefinitionMigrations(contentProvider: ContentProvider, currentVersion: number): Promise<void> {
        const relevantContentFieldDefinitionMigrationVersions = contentProvider.getContentFieldDefinitionMigrations()
            .filter(contentFieldDefinitionMigration => contentFieldDefinitionMigration.version > currentVersion);

        if (relevantContentFieldDefinitionMigrationVersions.length > 0) {
            this.logger.debug(`Executing content field definition migrations.`);
            for (const contentFieldDefinitionMigrationVersion of relevantContentFieldDefinitionMigrationVersions) {
                for (const contentFieldDefinitionMigration of contentFieldDefinitionMigrationVersion.migration)
                    switch (contentFieldDefinitionMigration.operation) {
                        case MigrationOperation.Created: {
                            await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinitionMigration.contentFieldDefinition);
                            break;
                        }

                        case MigrationOperation.Deleted: {
                            await contentDefinitionManager.deleteContentFieldDefinitionByName(contentFieldDefinitionMigration.contentFieldDefinition.getName());
                            break;
                        }
                    }
            }
        }
    }
    
    private async executeContentDefinitionMigrations(contentProvider: ContentProvider, currentVersion: number): Promise<void> {
        const relevantContentDefinitionMigrationVersions = contentProvider.getContentDefinitionMigrations()
            .filter(contentDefinitionMigration => contentDefinitionMigration.version > currentVersion);

        if (relevantContentDefinitionMigrationVersions.length > 0) {
            this.logger.debug(`Executing content definition migrations.`);
            for (const contentDefinitionMigrationVersion of relevantContentDefinitionMigrationVersions) {
                for (const contentDefinitionMigration of contentDefinitionMigrationVersion.migration)
                    switch (contentDefinitionMigration.operation) {
                        case MigrationOperation.Created: {
                            await contentDefinitionManager.createContentDefinition(contentDefinitionMigration.contentDefinition);
                            break;
                        }
                        
                        case MigrationOperation.Updated: {
                            await contentDefinitionManager.updateContentDefinition(contentDefinitionMigration.contentDefinition);
                            break;
                        }

                        case MigrationOperation.Deleted: {
                            await contentDefinitionManager.deleteContentDefinitionByName(contentDefinitionMigration.contentDefinition.getName());
                            break;
                        }
                    }
            }
        }
    }
    
    private async executeContentMigrations(contentProvider: ContentProvider, currentVersion: number): Promise<void> {
        const relevantContentMigrationVersions = contentProvider.getContentMigrations()
            .filter(contentMigration => contentMigration.version > currentVersion);

        if (relevantContentMigrationVersions.length > 0) {
            this.logger.debug(`Executing content migrations.`);
            for (const contentMigrationVersion of relevantContentMigrationVersions) {
                for (const contentMigration of contentMigrationVersion.migration)
                    switch (contentMigration.operation) {
                        case MigrationOperation.Created: {
                            await contentManager.createContent(contentMigration.contentDefinitionName, contentMigration.content);
                            break;
                        }
                        
                        case MigrationOperation.Updated: {
                            await contentManager.updateContent(contentMigration.contentDefinitionName, contentMigration.content);
                            break;
                        }

                        case MigrationOperation.Deleted: {
                            await contentManager.deleteContent(contentMigration.contentDefinitionName, contentMigration.content.id);
                            break;
                        }
                    }
            }
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

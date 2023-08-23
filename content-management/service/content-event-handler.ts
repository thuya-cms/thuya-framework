import IContentEventHandler from "../domain/usecase/content/content-event-handler.interface";

/**
 * Content event handler.
 */
class ContentEventHandler implements IContentEventHandler {
    private createContentHandlers: {
        contentDefinitionName: string,
        callback: (contentDefinitionName: string, content: any) => Promise<void>
    }[] = [];
    private updateContentHandlers: {
        contentDefinitionName: string,
        callback: (contentDefinitionName: string, content: any) => Promise<void>
    }[] = [];
    private deleteContentHandlers: {
        contentDefinitionName: string,
        callback: (contentDefinitionName: string, id: string) => Promise<void>
    }[] = [];
    private readContentHandlers: {
        contentDefinitionName: string,
        callback: (contentDefinitionName: string, content: any) => Promise<void>
    }[] = [];
    private listContentHandlers: {
        contentDefinitionName: string,
        callback: (contentDefinitionName: string, contents: any[]) => Promise<void>
    }[] = [];


    
    /**
     * Subscribe to an event when a content is created.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentCreated(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        this.createContentHandlers.push({
            contentDefinitionName: contentDefinitionName,
            callback: callback
        });
    }
    
    /**
     * Subscribe to an event when a content is updated.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentUpdated(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        this.updateContentHandlers.push({
            contentDefinitionName: contentDefinitionName,
            callback: callback
        });
    }
    
    /**
     * Subscribe to an event when a content is deleted.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentDeleted(contentDefinitionName: string, callback: (contentDefinitionName: string, id: string) => Promise<void>): void {
        this.deleteContentHandlers.push({
            contentDefinitionName: contentDefinitionName,
            callback: callback
        });
    }
    
    /**
     * Subscribe to an event when a content is read.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentRead(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        this.readContentHandlers.push({
            contentDefinitionName: contentDefinitionName,
            callback: callback
        });
    }
    
    /**
     * Subscribe to an event when a content is listed.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentListed(contentDefinitionName: string, callback: (contentDefinitionName: string, contents: any[]) => Promise<void>): void {
        this.listContentHandlers.push({
            contentDefinitionName: contentDefinitionName,
            callback: callback
        });
    }
    
    /**
     * @inheritdoc
     */
    raiseContentCreated(contentDefinitionName: string, content: any): void {
        const handlers = this.createContentHandlers.filter(contentHandler => contentHandler.contentDefinitionName === contentDefinitionName);
        for (const handler of handlers) {
            handler.callback(contentDefinitionName, content);
        }
    }

    /**
     * @inheritdoc
     */
    raiseContentUpdated(contentDefinitionName: string, content: any): void {
        const handlers = this.updateContentHandlers.filter(contentHandler => contentHandler.contentDefinitionName === contentDefinitionName);
        for (const handler of handlers) {
            handler.callback(contentDefinitionName, content);
        }
    }

    /**
     * @inheritdoc
     */
    raiseContentDeleted(contentDefinitionName: string, id: string): void {
        const handlers = this.deleteContentHandlers.filter(contentHandler => contentHandler.contentDefinitionName === contentDefinitionName);
        for (const handler of handlers) {
            handler.callback(contentDefinitionName, id);
        }
    }

    /**
     * @inheritdoc
     */
    raiseContentRead(contentDefinitionName: string, content: any): void {
        const handlers = this.readContentHandlers.filter(contentHandler => contentHandler.contentDefinitionName === contentDefinitionName);
        for (const handler of handlers) {
            handler.callback(contentDefinitionName, content);
        }
    }

    /**
     * @inheritdoc
     */
    raiseContentListed(contentDefinitionName: string, contents: any[]): void {
        const handlers = this.listContentHandlers.filter(contentHandler => contentHandler.contentDefinitionName === contentDefinitionName);
        for (const handler of handlers) {
            handler.callback(contentDefinitionName, contents);
        }
    }

    /**
     * Clear the event handlers.
     */
    clear(): void {
        this.createContentHandlers = [];
        this.updateContentHandlers = [];
        this.deleteContentHandlers = [];
        this.readContentHandlers = [];
        this.listContentHandlers = [];
    }
}

export default new ContentEventHandler();
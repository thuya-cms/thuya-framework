import contentEventHandler from "../service/content-event-handler";

/**
 * Event handler for content.
 */
class ContentEventHandler {
    /**
     * Subscribe to an event when a content is created.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentCreated(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        contentEventHandler.subscribeContentCreated(contentDefinitionName, callback);
    }
    
    /**
     * Subscribe to an event when a content is updated.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentUpdated(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        contentEventHandler.subscribeContentUpdated(contentDefinitionName, callback);
    }
    
    /**
     * Subscribe to an event when a content is deleted.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentDeleted(contentDefinitionName: string, callback: (contentDefinitionName: string, id: string) => Promise<void>): void {
        contentEventHandler.subscribeContentDeleted(contentDefinitionName, callback);
    }
    
    /**
     * Subscribe to an event when a content is read.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentRead(contentDefinitionName: string, callback: (contentDefinitionName: string, content: any) => Promise<void>): void {
        contentEventHandler.subscribeContentRead(contentDefinitionName, callback);
    }
    
    /**
     * Subscribe to an event when a content is listed.
     * 
     * @param contentDefinitionName the name of the content definition
     * @param callback the callback function
     */
    subscribeContentListed(contentDefinitionName: string, callback: (contentDefinitionName: string, contents: any[]) => Promise<void>): void {
        contentEventHandler.subscribeContentListed(contentDefinitionName, callback);
    }
}

export default new ContentEventHandler();
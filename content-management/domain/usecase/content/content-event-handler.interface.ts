interface IContentEventHandler {
    /**
     * Raise a new event that a content is created.
     * 
     * @param contentDefinitionName the content definition name
     * @param content the content
     */
    raiseContentCreated(contentDefinitionName: string, content: any): void;

    /**
     * Raise a new event that a content is updated.
     * 
     * @param contentDefinitionName the content definition name
     * @param content the content
     */
    raiseContentUpdated(contentDefinitionName: string, content: any): void;
    
    /**
     * Raise a new event that a content is deleted.
     * 
     * @param contentDefinitionName the content definition name
     * @param id the id of the content
     */
    raiseContentDeleted(contentDefinitionName: string, id: string): void;
    
    /**
     * Raise a new event that a content is read.
     * 
     * @param contentDefinitionName the content definition name
     * @param content the content
     */
    raiseContentRead(contentDefinitionName: string, content: any): void;
    
    /**
     * Raise a new event that a content is listed.
     * 
     * @param contentDefinitionName the content definition name
     * @param contents the list of content
     */
    raiseContentListed(contentDefinitionName: string, contents: any[]): void;
}

export default IContentEventHandler;
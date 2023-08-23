import localContentManagementPersistency from "../persistency/local-content-management-persistency";
import IContentDefinitionPersistency from "../persistency/content-definition-persistency.interface";
import IContentPersistency from "../persistency/content-persistency.interface";
import IContentEventHandler from "./usecase/content/content-event-handler.interface";
import contentEventHandler from "../service/content-event-handler";

/**
 * Factory to get and set objects used by the domain.
 */
class Factory {
    private contentDefinitionPersistency: IContentDefinitionPersistency;
    private contentPersistency: IContentPersistency;
    private contentEventHandler: IContentEventHandler;
    


    constructor() {
        this.contentDefinitionPersistency = localContentManagementPersistency;
        this.contentPersistency = localContentManagementPersistency;
        this.contentEventHandler = contentEventHandler;
    }



    /**
     * Set the content definition persistency implementation.
     * 
     * @param persistency the content definition persistency implementation
     */
    setContentDefinitionPersistency(persistency: IContentDefinitionPersistency): void {
        this.contentDefinitionPersistency = persistency;
    }

    /**
     * @returns persistency the content definition persistency implementation
     */
    getContentDefinitionPersistency(): IContentDefinitionPersistency {
        return this.contentDefinitionPersistency;
    }
    
    /**
     * Set the content persistency implementation.
     * 
     * @param persistency the content persistency implementation
     */
    setContentPersistency(persistency: IContentPersistency): void {
        this.contentPersistency = persistency;
    }

    /**
     * @returns persistency the content persistency implementation
     */
    getContentPersistency(): IContentPersistency {
        return this.contentPersistency;
    }

    /**
     * @returns the content event handler implementation
     */
    getContentEventHandler(): IContentEventHandler {
        return this.contentEventHandler;
    }
}

export default new Factory();
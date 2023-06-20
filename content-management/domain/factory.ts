import localContentManagementPersistency from "../persistency/local-content-management-persistency";
import IContentDefinitionPersistency from "../persistency/content-definition-persistency.interface";
import IContentPersistency from "../persistency/content-persistency.interface";

/**
 * Factory to get and set objects used by the domain.
 */
class Factory {
    private contentDefinitionPersistency: IContentDefinitionPersistency;
    private contentPersistency: IContentPersistency;
    


    constructor() {
        this.contentDefinitionPersistency = localContentManagementPersistency;
        this.contentPersistency = localContentManagementPersistency;
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
}

export default new Factory();
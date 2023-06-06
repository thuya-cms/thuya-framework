import localContentManagementPersistency from "../persistency/local-content-management-persistency";
import IContentDefinitionPersistency from "../persistency/content-definition-persistency.interface";
import IContentPersistency from "../persistency/content-persistency.interface";

class Factory {
    private contentDefinitionPersistency: IContentDefinitionPersistency;
    private contentPersistency: IContentPersistency;
    


    constructor() {
        this.contentDefinitionPersistency = localContentManagementPersistency;
        this.contentPersistency = localContentManagementPersistency;
    }



    setContentDefinitionPersistency(persistency: IContentDefinitionPersistency) {
        this.contentDefinitionPersistency = persistency;
    }

    getContentDefinitionPersistency(): IContentDefinitionPersistency {
        return this.contentDefinitionPersistency;
    }
    
    setContentPersistency(persistency: IContentPersistency) {
        this.contentPersistency = persistency;
    }

    getContentPersistency(): IContentPersistency {
        return this.contentPersistency;
    }
}

export default new Factory();
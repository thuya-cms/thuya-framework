import localContentManagementPersistency from "../persistency/local-content-management-persistency";
import IContentDefinitionPersistency from "../persistency/content-definition-persistency.interface";
import IContentPersistency from "../persistency/content-persistency.interface";
import IContentCache from "../persistency/content-cache.interface";
import localContentCache from "../persistency/local-content-cache";

class Factory {
    private contentDefinitionPersistency: IContentDefinitionPersistency;
    private contentPersistency: IContentPersistency;
    private contentCache: IContentCache;
    


    constructor() {
        this.contentDefinitionPersistency = localContentManagementPersistency;
        this.contentPersistency = localContentManagementPersistency;
        this.contentCache = localContentCache;
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
    
    setContentCache(cache: IContentCache) {
        this.contentCache = cache;
    }

    getContentCache(): IContentCache {
        return this.contentCache;
    }
}

export default new Factory();
import localContentManagementPersistency from "../persistency/local-content-management-persistency";
import IContentManagementPersistency from "./usecase/persistency.interface";

class Factory {
    private persistency: IContentManagementPersistency;
    


    constructor() {
        this.persistency = localContentManagementPersistency;
    }



    setPersistency(persistency: IContentManagementPersistency) {
        this.persistency = persistency;
    }

    getPersistency(): IContentManagementPersistency {
        return this.persistency;
    }
}

export default new Factory();
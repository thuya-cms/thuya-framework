import { ContentDefinition } from "./content-management/domain/entity/content-definition";
import { ContentFieldDefinition } from "./content-management/domain/entity/content-field-definition/content-field-definition";

abstract class ContentProvider {
    constructor() {
        this.createContentFieldDefinitions();
        this.createContentDefinitions();
    }



    getContentFieldDefinitions(): ContentFieldDefinition[] {
        return [];
    }

    getContentDefinitions(): ContentDefinition<any>[] {
        return [];
    }


    protected createContentFieldDefinitions() {}
    protected createContentDefinitions() {}
}

export default ContentProvider;
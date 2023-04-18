import { ContentDefinition } from "./content-management/domain/entity/content-definition";
import { ContentFieldDefinition } from "./content-management/domain/entity/content-field-definition";
import { ContentFieldGroupDefinition } from "./content-management/domain/entity/content-field-group-definition";

abstract class ContentProvider {
    constructor() {
        this.createContentFieldDefinitions();
        this.createContentFieldGroupDefinitions();
        this.createContentDefinitions();
    }



    getContentFieldDefinitions(): ContentFieldDefinition[] {
        return [];
    }

    getContentFieldGroupDefinitions(): ContentFieldGroupDefinition<any>[] {
        return [];
    }

    getContentDefinitions(): ContentDefinition<any>[] {
        return [];
    }


    protected createContentFieldDefinitions() {}
    protected createContentFieldGroupDefinitions() {}
    protected createContentDefinitions() {}
}

export default ContentProvider;
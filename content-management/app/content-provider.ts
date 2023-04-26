import ContentDefinitionDTO from "./dto/content-definition";
import { ContentFieldDefinitionDTO } from "./dto/content-field-definition/content-field-definition";

abstract class ContentProvider {
    constructor() {
        this.createContentFieldDefinitions();
        this.createContentDefinitions();
    }



    getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [];
    }

    getContentDefinitions(): ContentDefinitionDTO<any>[] {
        return [];
    }


    protected createContentFieldDefinitions() {}
    protected createContentDefinitions() {}
}

export default ContentProvider;
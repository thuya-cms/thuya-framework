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

    getContentDefinitions(): ContentDefinitionDTO[] {
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    createContent() {
    }


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected createContentFieldDefinitions() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected createContentDefinitions() {}
}

export default ContentProvider;
import ContentDefinitionDTO from "./dto/content-definition/content-definition";
import { ContentFieldDefinitionDTO } from "./dto/content-field-definition/content-field-definition";

/**
 * Abstract content provider. 
 * Content providers are used by the framework to instantiate the definitions and initialize content.
 */
abstract class ContentProvider {
    /**
     * @returns an array of content field definitions 
     */
    getContentFieldDefinitions(): ContentFieldDefinitionDTO[] {
        return [];
    }

    /**
     * @returns an array of content definitions 
     */
    getContentDefinitions(): ContentDefinitionDTO[] {
        return [];
    }

    /**
     * Create initial content.
     * 
     * @returns
     * @async
     */
    createContent(): Promise<void> {
        return Promise.resolve();
    }
}

export default ContentProvider;
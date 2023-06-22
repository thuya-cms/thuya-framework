import ContentDefinitionDTO from "./dto/content-definition/content-definition";
import { ContentFieldDefinitionDTO } from "./dto/content-field-definition/content-field-definition";

enum MigrationOperation {
    Created = "created",
    Updated = "updated",
    Deleted = "deleted"
}

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
    getInitialContent(): { contentDefinitionName: string, content: any }[] {
        return [];
    }
    
    /**
     * @returns an array of content field definition migrations 
     */
    getContentFieldDefinitionMigrations(): { version: number, migration: { operation: MigrationOperation, contentFieldDefinition: ContentFieldDefinitionDTO }[] }[] {
        return [];
    }
    
    /**
     * @returns an array of content field definition migrations 
     */
    getContentDefinitionMigrations(): { version: number, migration: { operation: MigrationOperation, contentDefinition: ContentDefinitionDTO }[] }[] {
        return [];
    }
    
    /**
     * @returns an array of content field definition migrations 
     */
    getContentMigrations(): { version: number, migration: { operation: MigrationOperation, contentDefinitionName: string, content: any }[] }[] {
        return [];
    }
}

export { MigrationOperation };
export default ContentProvider;
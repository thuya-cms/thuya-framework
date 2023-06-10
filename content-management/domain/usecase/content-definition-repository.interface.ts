import { ContentDefinition } from "../entity/content-definition";
import { ContentFieldDefinition } from "../entity/content-field-definition/content-field-definition";

/**
 * Repository to manage content definition and content field definitions.
 */
interface IContentDefinitionRepository {
    /**
     * Read a content definition by name.
     * 
     * @param contentName name of the content definition
     * @returns the content definition or undefined
     */
    readContentDefinition(contentName: string): Promise<ContentDefinition | void>;
    
    /**
     * Create a content definition.
     * 
     * @param contentDefinition the content definition to create
     * @returns the id of the created content definition
     */
    createContentDefinition(contentDefinition: ContentDefinition): Promise<string>;

    /**
     * Delete a content definition by name.
     * 
     * @param contentName name of the content definition
     */
    deleteContentDefinitionByName(contentName: string): Promise<void>;

    /**
     * Create a content field definition.
     * 
     * @param contentFieldDefinition the content field to create
     * @returns the id of the created content field definition
     */
    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<string>;
}

export default IContentDefinitionRepository;
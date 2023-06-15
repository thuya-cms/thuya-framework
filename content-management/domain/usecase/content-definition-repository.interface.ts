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
     * List content definitions.
     * 
     * @returns the list of content definitions
     */
    listContentDefinitions(): Promise<ContentDefinition[]>;
    
    /**
     * Create a content definition.
     * 
     * @param contentDefinition the content definition to create
     * @returns the id of the created content definition
     */
    createContentDefinition(contentDefinition: ContentDefinition): Promise<string>;
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinition the content definition to update
     */
    updateContentDefinition(contentDefinition: ContentDefinition): Promise<void>;

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

    /**
     * Read a content field definition by name.
     * 
     * @param contentFieldName name of the content field definition
     * @returns the content field definition or undefined
     */
    readContentFieldDefinitionByName(contentFieldName: string): Promise<ContentFieldDefinition | void>;

    /**
     * Delete a content field definition by name.
     * 
     * @param contentFieldName name of the content field definition
     */
    deleteContentFieldDefinitionByName(contentFieldName: string): Promise<void>;
}

export default IContentDefinitionRepository;
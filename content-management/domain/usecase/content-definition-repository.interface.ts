import { ContentDefinition } from "../entity/content-definition/content-definition";
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
     * @async
     */
    readContentDefinition(contentName: string): Promise<ContentDefinition | void>;

    /**
     * List content definitions.
     * 
     * @returns the list of content definitions
     * @async
     */
    listContentDefinitions(): Promise<ContentDefinition[]>;
    
    /**
     * Create a content definition.
     * 
     * @param contentDefinition the content definition to create
     * @returns the id of the created content definition
     * @async
     */
    createContentDefinition(contentDefinition: ContentDefinition): Promise<string>;
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinition the content definition to update
     * @async
     */
    updateContentDefinition(contentDefinition: ContentDefinition): Promise<void>;

    /**
     * Delete a content definition by name.
     * 
     * @param contentName name of the content definition
     * @async
     */
    deleteContentDefinitionByName(contentName: string): Promise<void>;

    /**
     * Create a content field definition.
     * 
     * @param contentFieldDefinition the content field to create
     * @returns the id of the created content field definition
     * @async
     */
    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<string>;

    /**
     * Read a content field definition by name.
     * 
     * @param contentFieldName name of the content field definition
     * @returns the content field definition or undefined
     * @async
     */
    readContentFieldDefinitionByName(contentFieldName: string): Promise<ContentFieldDefinition | void>;

    /**
     * Delete a content field definition by name.
     * 
     * @param contentFieldName name of the content field definition
     * @async
     */
    deleteContentFieldDefinitionByName(contentFieldName: string): Promise<void>;

    /**
     * Update a content field definition.
     * 
     * @param contentFieldDefinition the content field definition
     * @async
     */
    updateContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<void>;

    /**
     * List content field definitions.
     * 
     * @returns a list of the existing content field definitions
     * @async
     */
    listContentFieldDefinitions(): Promise<ContentFieldDefinition[]>;
}

export default IContentDefinitionRepository;
type ContentDefinitionData = {
    id: string,
    name: string,
    fields: {
        name: string,
        id: string,
        options: {
            isRequired: boolean,
            isUnique: boolean,
            isIndexed: boolean
        }
    }[]
}

type ExpandedContentDefinitionData = {
    id: string,
    name: string,
    fields: {
        field: ContentFieldDefinitionData,
        name: string,
        options: {
            isRequired: boolean,
            isUnique: boolean,
            isIndexed: boolean
        }
    }[]
}

type ContentFieldDefinitionData = {
    id: string,
    name: string,
    type: string,
    path: string,
    arrayElementDefinitionId?: string,
    groupElements?: {
        id: string,
        name: string,
        options: {
            isRequired: boolean
        }
    }[]
}

/**
 * Persistency to manage content definition and content field definition data.
 */
interface IContentDefinitionPersistency {
    /**
     * Read a content definition by name.
     * 
     * @param contentName the name of the content definition to read
     * @returns the data of the content definition
     */
    readContentDefinition(contentName: string): Promise<ContentDefinitionData | undefined>;

    /**
     * Read a content definition by name expanding the content fields.
     * 
     * @param contentName the name of the content definition to read
     * @returns the data of the expanded content definition
     */
    readContentDefinitionExpandingFields(contentName: string): Promise<ExpandedContentDefinitionData | undefined>;

    /**
     * List content definitions.
     * 
     * @returns the list of content definitions data
     */
    listContentDefinitions(): Promise<ExpandedContentDefinitionData[]>;

    /**
     * Read a content definition by id.
     * 
     * @param id the id of the content definition to read
     * @returns the data of the content field definition
     */
    readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData>;

    /**
     * Read a content field definition by name.
     * 
     * @param name the name of the content field definition to read
     * @returns the data of the content field definition
     */
    readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData>;

    /**
     * Create a content definition.
     * 
     * @param contentDefinitionData the data of content definition to create 
     * @returns the id of the created content definition
     */
    createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string>;
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinitionData the data of content definition to update 
     */
    updateContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<void>;

    /**
     * Delete a content definition by name.
     * 
     * @param contentName the name of the content definition
     */
    deleteContentDefinitionByName(contentName: string): Promise<void>;

    /**
     * Create a content field definition.
     * 
     * @param contentFieldDefinitionData the data of the content field definition to create
     * @returns the id of the created content field definition
     */
    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string>;
}

export default IContentDefinitionPersistency;
export { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData };
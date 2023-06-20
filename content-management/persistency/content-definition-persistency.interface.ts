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
     * @param contentDefinitionName the name of the content definition to read
     * @returns the data of the content definition
     * @async
     */
    readContentDefinitionByName(contentDefinitionName: string): Promise<ContentDefinitionData | undefined>;

    /**
     * Read a content definition by name expanding the content fields.
     * 
     * @param contentDefinitionName the name of the content definition to read
     * @returns the data of the expanded content definition
     * @async
     */
    readContentDefinitionExpandingFields(contentDefinitionName: string): Promise<ExpandedContentDefinitionData | undefined>;

    /**
     * List content definitions.
     * 
     * @returns the list of content definitions data
     * @async
     */
    listContentDefinitions(): Promise<ExpandedContentDefinitionData[]>;

    /**
     * Read a content definition by id.
     * 
     * @param id the id of the content definition to read
     * @returns the data of the content field definition
     * @async
     */
    readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData | undefined>;

    /**
     * Read a content field definition by name.
     * 
     * @param contentFieldDefinitionName the name of the content field definition to read
     * @returns the data of the content field definition
     * @async
     */
    readContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<ContentFieldDefinitionData| undefined>;

    /**
     * Create a content definition.
     * 
     * @param contentDefinitionData the data of content definition to create 
     * @returns the id of the created content definition
     * @async
     */
    createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string>;
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinitionData the data of content definition to update 
     * @async
     */
    updateContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<void>;

    /**
     * Delete a content definition by name.
     * 
     * @param contentDefinitionName the name of the content definition
     * @async
     */
    deleteContentDefinitionByName(contentDefinitionName: string): Promise<void>;

    /**
     * Create a content field definition.
     * 
     * @param contentFieldDefinitionData the data of the content field definition to create
     * @returns the id of the created content field definition
     * @async
     */
    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string>;

    /**
     * Delete a content field definition by name.
     * 
     * @param contentFieldDefinitionName the name of the content field definition
     * @async
     */
    deleteContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<void>;

    /**
     * Update a content field definition.
     * 
     * @param contentFieldDefinitionData the data of the content field definition
     * @async
     */
    updateContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<void>;

    /**
     * List content field definitions.
     * 
     * @returns the list of content field definitions data
     * @async
     */
    listContentFieldDefinitions(): Promise<ContentFieldDefinitionData[]>;
}

export default IContentDefinitionPersistency;
export { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData };
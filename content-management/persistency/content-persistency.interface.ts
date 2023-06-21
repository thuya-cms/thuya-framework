import UnknownContent from "../domain/usecase/content/unknown-content.type";

type ArrayElement = {
    type: string,
    groupElements?: ContentSchemaElement[]
}

type ContentSchemaElement = {
    name: string,
    type: string,
    arrayElementType?: ArrayElement,
    groupElements?: ContentSchemaElement[],
    options: {
        isRequired: boolean,
        isUnique: boolean,
        isIndexed: boolean
    }
}

type ContentSchema = ContentSchemaElement[];

/**
 * Persistency to manage content.
 */
interface IContentPersistency {
    /**
     * Create a schema for a content.
     * 
     * @param contentDefinitionName name of the content definition
     * @param fields fields of the content definition
     * @async
     */
    createContentSchema(contentDefinitionName: string, fields: ContentSchema): Promise<void>;

    /**
     * Create a content.
     * 
     * @param contentDefinitionName name of the content definition 
     * @param content the content data
     * @param options options for the content
     * @returns the id of the created content
     * @async
     */
    createContent(contentDefinitionName: string, content: UnknownContent, options?: { indexedFields?: string[] }): Promise<string>;

    /**
     * Update a content.
     * 
     * @param contentDefinitionName name of the content definition 
     * @param content the content data
     * @async
     */
    updateContent(contentDefinitionName: string, content: UnknownContent): Promise<void>;

    /**
     * Delete a content.
     * 
     * @param contentDefinitionName name of the content definition  
     * @param id id of the content
     * @async
     */
    deleteContent(contentDefinitionName: string, id: string): Promise<void>;

    /**
     * Read a content by id.
     * 
     * @param contentDefinitionName name of the content definition  
     * @param id id of the content
     * @returns the data of the content
     * @async
     */
    readContentById(contentDefinitionName: string, id: string): Promise<UnknownContent>;

    /**
     * Read a content by field value.
     * 
     * @param fieldValue key and value of a field to be used as a filter
     * @param contentDefinitionName name of the content definition 
     * @returns the data of the content
     * @async
     */
    readContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string; value: any; }): Promise<UnknownContent>;

    /**
     * List content for a content definition.
     * 
     * @param contentDefinitionName name of the content definition
     * @returns the list of content 
     * @async
     */
    listContent(contentDefinitionName: string): Promise<UnknownContent[]>;

    /**
     * List content by field value.
     * 
     * @param fieldValue key and value of a field to be used as a filter
     * @param contentDefinitionName name of the content definition 
     * @returns the data of all content matching the field value
     * @async
     */
    listContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string; value: any; }): Promise<UnknownContent[]>;
}

export { ContentSchema, ContentSchemaElement, ArrayElement };
export default IContentPersistency;
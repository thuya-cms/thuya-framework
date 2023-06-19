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
     * @param contentName name of the content definition
     * @param fields fields of the content definition
     */
    createContentSchema(contentName: string, fields: ContentSchema): Promise<void>;

    /**
     * Create a content.
     * 
     * @param contentName name of the content definition 
     * @param content the content data
     * @param options options for the content
     * @returns the id of the created content
     */
    createContent(contentName: string, content: UnknownContent, options?: { indexedFields?: string[] }): Promise<string>;

    /**
     * Update a content.
     * 
     * @param contentName name of the content definition 
     * @param content the content data
     */
    updateContent(contentName: string, content: UnknownContent): Promise<void>;

    /**
     * Delete a content.
     * 
     * @param contentName name of the content definition  
     * @param id id of the content
     */
    deleteContent(contentName: string, id: string): Promise<void>;

    /**
     * Read a content by id.
     * 
     * @param contentName name of the content definition  
     * @param id id of the content
     * @returns the data of the content
     */
    readContentByName(contentName: string, id: string): Promise<UnknownContent>;

    /**
     * Read a content by field value.
     * 
     * @param fieldValue key and value of a field to be used as a filter
     * @param contentName name of the content definition 
     * @returns the data of the content
     */
    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string): Promise<UnknownContent>;

    /**
     * List content for a content definition.
     * 
     * @param contentName name of the content definition
     * @returns the list of content 
     */
    listContent(contentName: string): Promise<UnknownContent[]>;
}

export { ContentSchema, ContentSchemaElement, ArrayElement };
export default IContentPersistency;
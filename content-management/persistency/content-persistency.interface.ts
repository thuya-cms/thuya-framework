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

interface IContentPersistency {
    createContentSchema(contentName: string, fields: ContentSchema): Promise<void>;
    createContent(contentName: string, content: UnknownContent, options?: { indexedFields?: string[] }): Promise<string>;
    updateContent(contentName: string, content: UnknownContent): Promise<void>;
    deleteContent(contentName: string, id: string): Promise<void>;
    readContent(contentName: string, id: string): Promise<UnknownContent>;
    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string): Promise<UnknownContent>;
    listContent(contentName: string): Promise<UnknownContent[]>;
}

export { ContentSchema, ContentSchemaElement, ArrayElement };
export default IContentPersistency;
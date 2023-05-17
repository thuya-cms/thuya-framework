import UnknownContent from "./content/unknown-content.type";

interface IContentPersistency {
    createContent(contentName: string, content: UnknownContent, options?: { indexedFields?: string[] }): Promise<string>;
    updateContent(contentName: string, content: UnknownContent): Promise<void>;
    deleteContent(contentName: string, id: string): Promise<void>;
    readContent(contentName: string, id: string): Promise<UnknownContent>;
    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string): Promise<UnknownContent>;
    listContent(contentName: string): Promise<UnknownContent[]>;
}

export default IContentPersistency;
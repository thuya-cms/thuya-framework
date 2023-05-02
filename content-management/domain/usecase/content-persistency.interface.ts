interface IContentPersistency {
    createContent(contentName: string, content: any): string;
    updateContent(contentName: string, content: any): void;
    deleteContent(contentName: string, id: string): void;
    readContent(contentName: string, id: string): any;
    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string): any;
    listContent(contentName: string): any[];
}

export default IContentPersistency;
import { ContentDefinition } from "../entity/content-definition";

interface IContentManagementPersistency {
    deleteContent(contentName: string, id: string): void;
    readContent(contentName: string, id: string): any;
    readContentDefinition(contentName: string): ContentDefinition<any> | undefined;
    createContentDefinition(contentDefinition: ContentDefinition<any>): void;
    createContent(contentName: string, content: any): string;
    listContent(contentName: string): any[];
}

export default IContentManagementPersistency;
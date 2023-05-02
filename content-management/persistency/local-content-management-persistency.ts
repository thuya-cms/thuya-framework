import { ContentDefinition } from "../domain/entity/content-definition";
import IContentDefinitionPersistency from "../domain/usecase/content-definition-persistency.interface";
import {v4 as uuidv4} from 'uuid';
import IContentPersistency from "../domain/usecase/content-persistency.interface";

class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinition[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentDefinition(contentDefinition: ContentDefinition): void {
        this.contentDefinitions.push(contentDefinition);
    }
    
    createContent(contentName: string, content: any): string {
        let existingContent = this.content.find(existingContent => existingContent.contentName === contentName);

        if (!existingContent) {
            existingContent = {
                contentName: contentName,
                content: []
            };

            this.content.push(existingContent);
        }

        content.id = uuidv4();
        existingContent.content.push(content);

        return content.id;
    }

    deleteContent(contentName: string, id: string): void {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.content.findIndex(content => content["id"] === id);

        if (contentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(contentIndex, 1);
    }

    updateContent(contentName: string, content: any): void {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const oldContentIndex = contentList.content.findIndex(content => content["id"] === content.id);

        if (oldContentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(oldContentIndex, 1);
        contentList.content.push(content);
    }

    readContentDefinition(contentName: string): ContentDefinition | undefined {
        return this.contentDefinitions.find(contentDefinition => contentDefinition.getName() === contentName);
    }

    listContent(contentName: string): any[] {
        const list = this.content.find(content => content.contentName === contentName);

        return list ? list.content : [];
    }

    readContent(contentName: string, id: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const content = contentList.content.find(content => content["id"] === id);

        if (!content)
            throw new Error("Content not found.");

        return content;
    }

    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const content = contentList.content.find(content => content[fieldValue.name] === fieldValue.value);

        if (!content)
            throw new Error("Content not found.");

        return content;
    }

    clear() {
        this.content = [];
        this.contentDefinitions = [];
    }
}

export default new LocalContentManagementPersistency();
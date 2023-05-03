import { ContentDefinition } from "../domain/entity/content-definition";
import IContentDefinitionPersistency from "../domain/usecase/content-definition-persistency.interface";
import {v4 as uuidv4} from 'uuid';
import IContentPersistency from "../domain/usecase/content-persistency.interface";
import { ContentFieldDefinition } from "../domain";

type ContentDefinitionData = {
    id: string,
    name: string,
    fields: {
        name: string,
        id: string,
        options: {
            isRequired: boolean,
            isUnique: boolean
        }
    }[]
};

class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinitionData[] = [];
    private contentFieldDefinitions: {
        id: string,
        field: ContentFieldDefinition
    }[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentDefinition(contentDefinition: ContentDefinition): void {
        const contentDefinitionData: ContentDefinitionData = {
            id: uuidv4(),
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const field = this.contentFieldDefinitions.find(existingContentFieldDefinition => existingContentFieldDefinition.field.getName() === contentField.contentFieldDefinition.getName());

            if (!field)
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);

            const fieldData = {
                id: field.id,
                name: contentField.name,
                options: {
                    isRequired: false,
                    isUnique: false
                }
            };

            if (contentField.options) {
                fieldData.options.isRequired = contentField.options.isRequired || false;
                fieldData.options.isUnique = contentField.options.isUnique || false;
            }

            contentDefinitionData.fields.push(fieldData);
        }

        this.contentDefinitions.push(contentDefinitionData);
    }

    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): void {
        this.contentFieldDefinitions.push({
            id: uuidv4(),
            field: contentFieldDefinition
        });
    }

    readContentDefinition(contentName: string): ContentDefinition | undefined {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);

        if (!contentDefinitionData) return undefined;

        const contentDefinitionResult = ContentDefinition.create(contentDefinitionData.id, contentDefinitionData.name);
        const contentDefinition = contentDefinitionResult.getResult()!;

        for (const contentFieldDefinitionAssignment of contentDefinitionData.fields) {
            const contentFieldDefinition = this.contentFieldDefinitions.find(existingContentFieldDefinition => existingContentFieldDefinition.id === contentFieldDefinitionAssignment.id);

            if (!contentFieldDefinition)
                throw new Error("Field not found.");

            contentDefinition.addContentField(contentFieldDefinitionAssignment.name, contentFieldDefinition.field, contentFieldDefinitionAssignment.options);
        }

        return contentDefinition;
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
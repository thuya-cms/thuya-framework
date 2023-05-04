import { ContentDefinition } from "../domain/entity/content-definition";
import IContentDefinitionPersistency from "../domain/usecase/content-definition-persistency.interface";
import {v4 as uuidv4} from 'uuid';
import IContentPersistency from "../domain/usecase/content-persistency.interface";
import { ArrayContentFieldDefinition, ContentFieldDefinition, ContentFieldType, DateContentFieldDefinition, GroupContentFieldDefinition, NumericContentFieldDefinition, TextContentFieldDefinition } from "../domain";

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

type ContentFieldDefinitionData = {
    id: string,
    name: string,
    type: string,
    arrayElementDefinitionId?: string,
    groupElements?: {
        id: string,
        name: string,
        options: {
            isRequired: boolean
        }
    }[]
};

class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinitionData[] = [];
    private contentFieldDefinitions: ContentFieldDefinitionData[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentDefinition(contentDefinition: ContentDefinition): void {
        const contentDefinitionData: ContentDefinitionData = {
            id: uuidv4(),
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const field = this.contentFieldDefinitions.find(existingContentFieldDefinition => 
                existingContentFieldDefinition.name === contentField.contentFieldDefinition.getName());

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

    readContentDefinition(contentName: string): ContentDefinition | undefined {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);

        if (!contentDefinitionData) return undefined;

        const contentDefinitionResult = ContentDefinition.create(contentDefinitionData.id, contentDefinitionData.name);
        const contentDefinition = contentDefinitionResult.getResult()!;

        for (const contentFieldDefinitionAssignment of contentDefinitionData.fields) {
            const contentFieldDefinitionData = this.contentFieldDefinitions.find(existingContentFieldDefinition => 
                existingContentFieldDefinition.id === contentFieldDefinitionAssignment.id);

            if (!contentFieldDefinitionData)
                throw new Error("Field not found.");

            const contentFieldDefinition = this.convertFieldDataToEntity(contentFieldDefinitionData);
            contentDefinition.addContentField(contentFieldDefinitionAssignment.name, contentFieldDefinition, contentFieldDefinitionAssignment.options);
        }

        return contentDefinition;
    }

    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): void {
        const contentFieldDefinitionData: ContentFieldDefinitionData = {
            id: uuidv4(),
            name: contentFieldDefinition.getName(),
            type: contentFieldDefinition.getType()
        };

        if (contentFieldDefinition.getType() === ContentFieldType.Array) {
            const arrayFieldDefinition = contentFieldDefinition as ArrayContentFieldDefinition;

            const arrayElementDefinitionData = this.contentFieldDefinitions.find(existingContentFieldDefinition =>
                existingContentFieldDefinition.name === arrayFieldDefinition.getArrayElementType().getName());

            if (!arrayElementDefinitionData)
                throw new Error("Array element type not found.")

            contentFieldDefinitionData.arrayElementDefinitionId = arrayElementDefinitionData.id;
        }

        if (contentFieldDefinition.getType() === ContentFieldType.Group) {
            contentFieldDefinitionData.groupElements = [];

            const groupFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
            for (const groupElement of groupFieldDefinition.getContentFields()) {
                const groupElementDefinitionData = this.contentFieldDefinitions.find(existingContentFieldDefinition =>
                    existingContentFieldDefinition.name === groupElement.contentFieldDefinition.getName());

                if (!groupElementDefinitionData)
                    throw new Error("Group element not found.");

                contentFieldDefinitionData.groupElements.push({
                    id: groupElementDefinitionData.id,
                    name: groupElement.name,
                    options: {
                        isRequired: false
                    }
                });
            }
        }
        
        this.contentFieldDefinitions.push(contentFieldDefinitionData);
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


    private convertFieldDataToEntity(contentFieldDefinitionData: ContentFieldDefinitionData) {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionData.type) {
            case ContentFieldType.Array: {
                const arrayElementDefinitionData = this.contentFieldDefinitions.find(existingContentFieldDefinition =>
                    existingContentFieldDefinition.id === contentFieldDefinitionData.arrayElementDefinitionId);

                if (!arrayElementDefinitionData) 
                    throw new Error("Array field element type is not defined.");

                const arrayElementDefinition = this.convertFieldDataToEntity(arrayElementDefinitionData);
                const createArrayFieldDefinitionResult = ArrayContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name, arrayElementDefinition);
                contentFieldDefinition = createArrayFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Date: {
                const createDateFieldDefinitionResult = DateContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createDateFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Group: {
                const createGroupFieldDefinitionResult = GroupContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                const groupContentField = createGroupFieldDefinitionResult.getResult()!;
                
                if (contentFieldDefinitionData.groupElements) {
                    for (const groupElement of contentFieldDefinitionData.groupElements) {
                        const groupElementDefinitionData = this.contentFieldDefinitions.find(existingContentFieldDefinition =>
                            existingContentFieldDefinition.id === groupElement.id);
    
                        if (!groupElementDefinitionData) 
                            throw new Error("Unknown group element type.");
    
                        groupContentField.addContentField(groupElement.name, this.convertFieldDataToEntity(groupElementDefinitionData), groupElement.options);
                    }
                }

                contentFieldDefinition = groupContentField;

                break;
            }

            case ContentFieldType.Numeric: {
                const createNumericFieldDefinitionResult = NumericContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createNumericFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Text: {
                const createTextFieldDefinitionResult = TextContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createTextFieldDefinitionResult.getResult()!;

                break;
            }

            default: 
                throw new Error("Invalid field type.");
        }

        return contentFieldDefinition!;
    }
}

export default new LocalContentManagementPersistency();
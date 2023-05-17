import IContentDefinitionPersistency, { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData } from "./content-definition-persistency.interface";
import {v4 as uuid} from 'uuid';
import IContentPersistency from "../domain/usecase/content-persistency.interface";
import { ContentFieldDefinition, ContentFieldType } from "../domain/entity/content-field-definition/content-field-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";

class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinitionData[] = [];
    private contentFieldDefinitions: ContentFieldDefinitionData[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string> {
        contentDefinitionData.id = uuid();
        this.contentDefinitions.push(contentDefinitionData);

        return Promise.resolve(contentDefinitionData.id);
    }

    readContentDefinition(contentName: string): Promise<ContentDefinitionData> {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);

        if (!contentDefinitionData)
            throw new Error("Content definition not found.");

        return Promise.resolve(contentDefinitionData);
    }

    readContentDefinitionExpandingFields(contentName: string): Promise<ExpandedContentDefinitionData> {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);
        
        if (!contentDefinitionData)
            throw new Error("Content definition not found.");
        
        const expandedData: ExpandedContentDefinitionData = {
            id: contentDefinitionData.id,
            name: contentDefinitionData.name,
            fields: []
        };

        for (const fieldReference of contentDefinitionData.fields) {
            const field = this.contentFieldDefinitions.find(field => field.id === fieldReference.id);

            if (!field)
                throw new Error("Not existing field.");

            expandedData.fields.push({
                name: fieldReference.name,
                options: fieldReference.options,
                field: field
            });
        }

        return Promise.resolve(expandedData);
    }
    
    readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData> {
        const contentDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.id === id);

        if (!contentDefinitionData)
            throw new Error("Content definition not found.");

        return Promise.resolve(contentDefinitionData);
    }
    
    readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData> {
        const contentDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.name === name);

        if (!contentDefinitionData)
            throw new Error("Content definition not found.");

        return Promise.resolve(contentDefinitionData);
    }

    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string> {
        contentFieldDefinitionData.id = uuid();
        this.contentFieldDefinitions.push(contentFieldDefinitionData);

        return Promise.resolve(contentFieldDefinitionData.id);
    }

    
    createContent(contentName: string, content: any) {
        let existingContent = this.content.find(existingContent => existingContent.contentName === contentName);

        if (!existingContent) {
            existingContent = {
                contentName: contentName,
                content: []
            };

            this.content.push(existingContent);
        }

        content.id = uuid();
        existingContent.content.push(content);

        return Promise.resolve(content.id);
    }

    deleteContent(contentName: string, id: string): Promise<void> {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.content.findIndex(content => content["id"] === id);

        if (contentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(contentIndex, 1);

        return Promise.resolve();
    }

    updateContent(contentName: string, content: any): Promise<void> {
        const contentList = this.content.find(content => content.contentName === contentName);
        
        if (!contentList)
            throw new Error("Content not found.");

        const oldContentIndex = contentList.content.findIndex(content => content["id"] === content.id);

        if (oldContentIndex === -1)
            throw new Error("Content not found.");

        contentList.content.splice(oldContentIndex, 1);
        contentList.content.push(content);

        return Promise.resolve();
    }

    listContent(contentName: string) {
        const list = this.content.find(content => content.contentName === contentName);

        return list ? Promise.resolve(list.content) : Promise.resolve([]);
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
        this.contentFieldDefinitions = [];
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
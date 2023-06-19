import IContentDefinitionPersistency, { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData } from "./content-definition-persistency.interface";
import {v4 as uuid} from 'uuid';
import IContentPersistency from "./content-persistency.interface";

class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinitionData[] = [];
    private contentFieldDefinitions: ContentFieldDefinitionData[] = [];
    private content: { contentName: string, content: any[] }[] = [];
    
    
    
    createContentSchema(): Promise<void> {
        return Promise.resolve();
    }

    async createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string> {
        contentDefinitionData.id = uuid();
        this.contentDefinitions.push(contentDefinitionData);

        return contentDefinitionData.id;
    }

    async updateContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<void> {
        const index = this.contentDefinitions.findIndex(contentDefinition => contentDefinition.id === contentDefinitionData.id);

        if (index === -1) 
            throw new Error(`Content definition with id "${ contentDefinitionData.id }" not found.`);

        this.contentDefinitions[index] = contentDefinitionData;
    }

    async deleteContentDefinitionByName(contentName: string): Promise<void> {
        const index = this.contentDefinitions.findIndex(contentDefinition => contentDefinition.name === contentName);

        if (index === -1) 
            throw new Error("Content definition not found.");

        this.contentDefinitions.splice(index, 1);
    }

    async readContentDefinition(contentName: string): Promise<ContentDefinitionData | undefined> {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);

        return contentDefinitionData;
    }

    async listContentDefinitions(): Promise<ExpandedContentDefinitionData[]> {
        const expandedDataList: ExpandedContentDefinitionData[] = [];

        for (const contentDefinitionData of this.contentDefinitions) {
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
    
            expandedDataList.push(expandedData);
        }

        return expandedDataList;
    }

    async readContentDefinitionExpandingFields(contentName: string): Promise<ExpandedContentDefinitionData | undefined> {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);
        
        if (!contentDefinitionData)
            return;
        
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

        return expandedData;
    }
    
    async readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData | undefined> {
        const contentFieldDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.id === id);
        return contentFieldDefinitionData;
    }
    
    async readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData | undefined> {
        const contentFieldDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.name === name);
        return contentFieldDefinitionData;
    }

    async createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string> {
        contentFieldDefinitionData.id = uuid();
        this.contentFieldDefinitions.push(contentFieldDefinitionData);

        return contentFieldDefinitionData.id;
    }

    async deleteContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<void> {
        const contentFieldDefinitionIndex = this.contentFieldDefinitions.findIndex(contentFieldDefinition => contentFieldDefinition.name === contentFieldDefinitionName);

        if (contentFieldDefinitionIndex === -1) 
            throw new Error("Content field definition not found in the database.");

        this.contentFieldDefinitions.splice(contentFieldDefinitionIndex, 1);
    }

    async updateContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<void> {
        const index = this.contentFieldDefinitions.findIndex(contentFieldDefinition => contentFieldDefinition.id === contentFieldDefinitionData.id);

        if (index === -1) 
            throw new Error(`Content field definition with id "${ contentFieldDefinitionData.id }" not found.`);

        this.contentFieldDefinitions[index] = contentFieldDefinitionData;
    }

    async listContentFieldDefinitions(): Promise<ContentFieldDefinitionData[]> {
        return this.contentFieldDefinitions;
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

    readContentByName(contentName: string, id: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        if (!contentList)
            return;

        const content = contentList.content.find(content => content["id"] === id);
        if (!content)
            return;

        return content;
    }

    readContentByFieldValue(fieldValue: { name: string; value: any; }, contentName: string) {
        const contentList = this.content.find(content => content.contentName === contentName);
        if (!contentList)
            return;

        const content = contentList.content.find(content => content[fieldValue.name] === fieldValue.value);
        if (!content)
            return;

        return content;
    }

    clear() {
        this.content = [];
        this.contentDefinitions = [];
        this.contentFieldDefinitions = [];
    }
}

export default new LocalContentManagementPersistency();
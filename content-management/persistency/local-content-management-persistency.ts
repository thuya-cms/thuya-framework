import IContentDefinitionPersistency, { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData } from "./content-definition-persistency.interface";
import {v4 as uuid} from 'uuid';
import IContentPersistency from "./content-persistency.interface";
import UnknownContent from "../domain/usecase/content/unknown-content.type";

/**
 * Persistency for content, content definition and content field definition. 
 * It stores the data in memory.
 */
class LocalContentManagementPersistency implements IContentDefinitionPersistency, IContentPersistency {
    private contentDefinitions: ContentDefinitionData[] = [];
    private contentFieldDefinitions: ContentFieldDefinitionData[] = [];
    private content: any = {};
    
    
    
    /**
     * @inheritdoc
     */
    createContentSchema(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * @inheritdoc
     */
    async createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string> {
        contentDefinitionData.id = uuid();
        this.contentDefinitions.push(contentDefinitionData);

        return contentDefinitionData.id;
    }

    /**
     * @inheritdoc
     */
    async updateContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<void> {
        const index = this.contentDefinitions.findIndex(contentDefinition => contentDefinition.id === contentDefinitionData.id);
        if (index === -1) 
            throw new Error(`Content definition with id "${ contentDefinitionData.id }" not found.`);

        this.contentDefinitions[index] = contentDefinitionData;
    }

    /**
     * @inheritdoc
     */
    async deleteContentDefinitionByName(contentName: string): Promise<void> {
        const index = this.contentDefinitions.findIndex(contentDefinition => contentDefinition.name === contentName);
        if (index === -1) 
            throw new Error("Content definition not found.");

        this.contentDefinitions.splice(index, 1);
    }

    /**
     * @inheritdoc
     */
    async readContentDefinitionByName(contentName: string): Promise<ContentDefinitionData | undefined> {
        const contentDefinitionData = this.contentDefinitions.find(contentDefinition => contentDefinition.name === contentName);

        return contentDefinitionData;
    }

    /**
     * @inheritdoc
     */
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

    /**
     * @inheritdoc
     */
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
    
    /**
     * @inheritdoc
     */
    async readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData | undefined> {
        const contentFieldDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.id === id);
        return contentFieldDefinitionData;
    }
    
    /**
     * @inheritdoc
     */
    async readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData | undefined> {
        const contentFieldDefinitionData = this.contentFieldDefinitions.find(contentFieldDefinition => contentFieldDefinition.name === name);
        return contentFieldDefinitionData;
    }

    /**
     * @inheritdoc
     */
    async createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string> {
        contentFieldDefinitionData.id = uuid();
        this.contentFieldDefinitions.push(contentFieldDefinitionData);

        return contentFieldDefinitionData.id;
    }

    /**
     * @inheritdoc
     */
    async deleteContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<void> {
        const contentFieldDefinitionIndex = this.contentFieldDefinitions.findIndex(contentFieldDefinition => contentFieldDefinition.name === contentFieldDefinitionName);

        if (contentFieldDefinitionIndex === -1) 
            throw new Error("Content field definition not found in the database.");

        this.contentFieldDefinitions.splice(contentFieldDefinitionIndex, 1);
    }

    /**
     * @inheritdoc
     */
    async updateContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<void> {
        const index = this.contentFieldDefinitions.findIndex(contentFieldDefinition => contentFieldDefinition.id === contentFieldDefinitionData.id);
        if (index === -1) 
            throw new Error(`Content field definition with id "${ contentFieldDefinitionData.id }" not found.`);

        this.contentFieldDefinitions[index] = contentFieldDefinitionData;
    }

    /**
     * @inheritdoc
     */
    async listContentFieldDefinitions(): Promise<ContentFieldDefinitionData[]> {
        return this.contentFieldDefinitions;
    }

    
    /**
     * @inheritdoc
     */
    async createContent(contentDefinitionName: string, content: any): Promise<any> {
        let existingContent = this.content[contentDefinitionName];
        if (!existingContent) {
            existingContent = [];
            this.content[contentDefinitionName] = existingContent;
        }

        content.id = uuid();
        existingContent.push(content);

        return content.id;
    }

    /**
     * @inheritdoc
     */
    async deleteContent(contentDefinitionName: string, id: string): Promise<void> {
        const contentList = this.content[contentDefinitionName];
        if (!contentList)
            throw new Error("Content not found.");

        const contentIndex = contentList.findIndex((content: any) => content["id"] === id);
        if (contentIndex === -1)
            throw new Error("Content not found.");

        contentList.splice(contentIndex, 1);
    }

    /**
     * @inheritdoc
     */
    async updateContent(contentDefinitionName: string, content: UnknownContent): Promise<void> {
        const contentList = this.content[contentDefinitionName];
        if (!contentList)
            throw new Error("Content not found.");

        const oldContentIndex = contentList.findIndex((content: any) => content["id"] === content.id);
        if (oldContentIndex === -1)
            throw new Error("Content not found.");

        contentList.splice(oldContentIndex, 1);
        contentList.push(content);
    }

    /**
     * @inheritdoc
     */
    async listContent(contentDefinitionName: string): Promise<UnknownContent> {
        const list = this.content[contentDefinitionName];

        return list ? Promise.resolve(list) : Promise.resolve([]);
    }

    /**
     * @inheritdoc
     */
    async readContentById(contentDefinitionName: string, id: string): Promise<UnknownContent> {
        const contentList = this.content[contentDefinitionName];
        if (!contentList)
            return;

        const content = contentList.find((content: any) => content["id"] === id);
        return content;
    }

    /**
     * @inheritdoc
     */
    async readContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string; value: any; }): Promise<UnknownContent> {
        const contentList = this.content[contentDefinitionName];
        if (!contentList)
            return;

        const content = contentList.find((content: any) => content[fieldValue.name] === fieldValue.value);
        return content;
    }

    /**
     * @inheritdoc
     */
    async listContentByFieldValue(contentDefinitionName: string, fieldValue: { name: string; value: any; }): Promise<any[]> {
        const contentList: any[] = this.content[contentDefinitionName];
        if (!contentList)
            return [];

        const matchingContent = contentList.filter((content: any) => content[fieldValue.name] === fieldValue.value);
        return matchingContent;
    }

    /**
     * Clear the stored values.
     */
    clear(): void {
        this.content = [];
        this.contentDefinitions = [];
        this.contentFieldDefinitions = [];
    }
}

export default new LocalContentManagementPersistency();
type ContentDefinitionData = {
    id: string,
    name: string,
    fields: {
        name: string,
        id: string,
        options: {
            isRequired: boolean,
            isUnique: boolean,
            isIndexed: boolean
        }
    }[]
}

type ExpandedContentDefinitionData = {
    id: string,
    name: string,
    fields: {
        field: ContentFieldDefinitionData,
        name: string,
        options: {
            isRequired: boolean,
            isUnique: boolean,
            isIndexed: boolean
        }
    }[]
}

type ContentFieldDefinitionData = {
    id: string,
    name: string,
    type: string,
    path: string,
    arrayElementDefinitionId?: string,
    groupElements?: {
        id: string,
        name: string,
        options: {
            isRequired: boolean
        }
    }[]
}

interface IContentDefinitionPersistency {
    readContentDefinition(contentName: string): Promise<ContentDefinitionData>;
    readContentDefinitionExpandingFields(contentName: string): Promise<ExpandedContentDefinitionData>;
    readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData>;
    readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData>;
    createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string>;
    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string>;
}

export default IContentDefinitionPersistency;
export { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData };
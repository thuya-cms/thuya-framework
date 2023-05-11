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
}

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
}

interface IContentDefinitionPersistency {
    readContentDefinition(contentName: string): Promise<ContentDefinitionData>;
    readContentFieldDefinitionById(id: string): Promise<ContentFieldDefinitionData>;
    readContentFieldDefinitionByName(name: string): Promise<ContentFieldDefinitionData>;
    createContentDefinition(contentDefinitionData: ContentDefinitionData): Promise<string>;
    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<string>;
}

export default IContentDefinitionPersistency;
export { ContentDefinitionData, ContentFieldDefinitionData };
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
    readContentDefinition(contentName: string): ContentDefinitionData;
    readContentFieldDefinitionById(id: string): ContentFieldDefinitionData;
    readContentFieldDefinitionByName(name: string): ContentFieldDefinitionData;
    createContentDefinition(contentDefinitionData: ContentDefinitionData): string;
    createContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): string;
}

export default IContentDefinitionPersistency;
export { ContentDefinitionData, ContentFieldDefinitionData };
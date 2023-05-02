import { ContentDefinition } from "../entity/content-definition";

interface IContentDefinitionPersistency {
    readContentDefinition(contentName: string): ContentDefinition | undefined;
    createContentDefinition(contentDefinition: ContentDefinition): void;
}

export default IContentDefinitionPersistency;
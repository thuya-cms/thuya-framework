import { ContentDefinition } from "../entity/content-definition";
import { ContentFieldDefinition } from "../entity/content-field-definition/content-field-definition";

interface IContentDefinitionRepository {
    readContentDefinition(contentName: string): ContentDefinition | undefined;
    createContentDefinition(contentDefinition: ContentDefinition): void;
    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): void;
}

export default IContentDefinitionRepository;
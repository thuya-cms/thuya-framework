import { ContentDefinition } from "../entity/content-definition";
import { ContentFieldDefinition } from "../entity/content-field-definition/content-field-definition";

interface IContentDefinitionRepository {
    readContentDefinition(contentName: string): Promise<ContentDefinition | void>;
    createContentDefinition(contentDefinition: ContentDefinition): Promise<string>;
    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<string>;
}

export default IContentDefinitionRepository;
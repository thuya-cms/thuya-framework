import { ContentDefinition } from "../domain/entity/content-definition";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";

class ContentDefinitionManager {
    createContentDefinition(contentDefinition: ContentDefinition<any>) {
        createContentDefinition.execute(contentDefinition);
    }
}

export default new ContentDefinitionManager();
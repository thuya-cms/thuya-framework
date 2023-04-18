import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class UpdateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T) {
        factory.getPersistency().updateContent(contentDefinition.getName(), content);
    }
}
export default new UpdateContent();
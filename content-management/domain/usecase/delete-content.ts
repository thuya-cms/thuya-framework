import { ContentDefinition } from "../entity/content-definition";
import factory from "../factory";

class DeleteContent<T> {
    execute(contentDefinition: ContentDefinition<T>, id: string) {
        factory.getPersistency().deleteContent(contentDefinition.getName(), id);
    }
}

export default new DeleteContent();
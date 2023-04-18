import { ContentDefinition } from "../entity/content-definition";
import factory from "../factory";

class ReadContent<T> {
    execute(contentDefinition: ContentDefinition<T>, id: string): T {
        return factory.getPersistency().readContent(contentDefinition.getName(), id);
    }
}

export default new ReadContent();
import { Result } from "../../../../common";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class ReadContent<T> {
    byId(contentDefinition: ContentDefinition<T>, id: string): Result<T> {
        try {
            return Result.success(factory.getContentPersistency().readContent(contentDefinition.getName(), id));
        }

        catch (error: any) {
            return Result.error("Failed to read content.");
        }
    }

    byFieldValue(contentDefinition: ContentDefinition<T>, fieldValue: { name: string, value: any }): Result<T> {
        try {
            return Result.success(factory.getContentPersistency().readContentByFieldValue(fieldValue, contentDefinition.getName()));
        }

        catch (error: any) {
            return Result.error("Failed to read content.");
        }
    }
}

export default new ReadContent();
import { Result } from "../../../../common";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class ReadContent<T extends { id: string }> {
    async byId(contentDefinition: ContentDefinition<T>, id: string): Promise<Result<T>> {
        try {
            return Result.success(await factory.getContentPersistency().readContent(contentDefinition.getName(), id));
        }

        catch (error: any) {
            return Result.error("Failed to read content.");
        }
    }

    async byFieldValue(contentDefinition: ContentDefinition<T>, fieldValue: { name: string, value: any }): Promise<Result<T[]>> {
        try {
            return Result.success(await factory.getContentPersistency().readContentByFieldValue(fieldValue, contentDefinition.getName()));
        }

        catch (error: any) {
            return Result.error("Failed to read content.");
        }
    }
}

export default new ReadContent();
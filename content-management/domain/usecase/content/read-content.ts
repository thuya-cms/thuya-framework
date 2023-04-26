import IdentifiableError from "../../../../common/identifiable-error";
import logger from "../../../../common/utility/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

enum ErrorCode {
    NotFound = "not-found",
}

class ReadContent<T> {
    byId(contentDefinition: ContentDefinition<T>, id: string): T {
        try {
            return factory.getPersistency().readContent(contentDefinition.getName(), id);
        }

        catch (error: any) {
            throw new IdentifiableError(ErrorCode.NotFound, "Failed to read content.");
        }
    }

    byFieldValue(contentDefinition: ContentDefinition<T>, fieldValue: { name: string, value: any }): T {
        try {
            return factory.getPersistency().readContentByFieldValue(fieldValue, contentDefinition.getName());
        }

        catch (error: any) {
            throw new IdentifiableError(ErrorCode.NotFound, "Failed to read content.");
        }
    }
}

export default new ReadContent();
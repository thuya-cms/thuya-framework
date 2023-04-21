import IdentifiableError from "../../../../identifiable-error";
import logger from "../../../../util/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

enum ErrorCode {
    NotFound = "not-found",
}

class ReadContent<T> {
    execute(contentDefinition: ContentDefinition<T>, id: string): T {
        try {
            return factory.getPersistency().readContent(contentDefinition.getName(), id);
        }

        catch (error: any) {
            logger.error(error.message);
            throw new IdentifiableError(ErrorCode.NotFound, "Failed to read content.");
        }
    }
}

export default new ReadContent();
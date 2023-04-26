import { logger } from "../../../../common";
import IdentifiableError from "../../../../common/identifiable-error";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

enum ErrorCode {
    NotFound = "not-found",
}

class ReadContentDefinition {
    execute(contentName: string): ContentDefinition<any> {
        let contentDefinition = factory.getPersistency().readContentDefinition(contentName);

        if (!contentDefinition) {
            logger.debug(`Content definition "%s" not found.`, contentName);
            throw new IdentifiableError(ErrorCode.NotFound, `Content definition "${ contentName }" not found.`);
        }

        return contentDefinition;
    }
}

export default new ReadContentDefinition();
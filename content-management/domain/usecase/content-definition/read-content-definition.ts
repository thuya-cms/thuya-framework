import { Result, logger } from "../../../../common";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class ReadContentDefinition {
    execute(contentName: string): Result<ContentDefinition> {
        let contentDefinition = factory.getContentDefinitionPersistency().readContentDefinition(contentName);

        if (!contentDefinition) {
            logger.debug(`Content definition "%s" not found.`, contentName);
            return Result.error(`Content definition "${ contentName }" not found.`);
        }

        return Result.success(contentDefinition);
    }
}

export default new ReadContentDefinition();
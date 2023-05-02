import { Result, logger } from "../../../../common";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class DeleteContent<T> {
    execute(contentDefinition: ContentDefinition<T>, id: string): Result {
        factory.getPersistency().deleteContent(contentDefinition.getName(), id);
        logger.info(`Content of type "%s" deleted successfully.`, contentDefinition.getName());

        return Result.success();
    }
}

export default new DeleteContent();
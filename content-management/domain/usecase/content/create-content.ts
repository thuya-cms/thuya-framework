import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import logger from "../../../../common/utility/logger";
import { Result } from "../../../../common";
import modifyHelper from "./util/modify-helper";

class CreateContent<T> {
    async execute(contentDefinition: ContentDefinition<T>, content: T): Promise<Result<string>> {
        const finalContentResult = await modifyHelper.convertData(contentDefinition, content);
        if (finalContentResult.getIsFailing()) 
            return Result.error(finalContentResult.getMessage());

        const id = await factory.getContentPersistency().createContent(contentDefinition.getName(), finalContentResult.getResult());
        logger.info(`Content of type "%s" is created successfully.`, contentDefinition.getName());

        return Result.success(id);
    }
}

export default new CreateContent();
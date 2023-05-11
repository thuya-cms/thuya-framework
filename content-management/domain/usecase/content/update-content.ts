import logger from "../../../../common/utility/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import { Result } from "../../../../common";
import modifyHelper from "./util/modify-helper";

enum ErrorCode {
    Required = "required",
    NotUnique = "not-unique"
}

class UpdateContent<T extends { id: string }> {
    async execute(contentDefinition: ContentDefinition<T>, content: T): Promise<Result> {
        const finalContentResult = await modifyHelper.convertData(contentDefinition, content);
        if (finalContentResult.getIsFailing()) 
            return Result.error(finalContentResult.getMessage());

        await factory.getContentPersistency().updateContent(contentDefinition.getName(), finalContentResult.getResult());
        logger.info(`Content of type "%s" is updated successfully.`, contentDefinition.getName());

        return Result.success();
    }
}

export default new UpdateContent();
export { ErrorCode };
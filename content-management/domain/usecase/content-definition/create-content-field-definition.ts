import { Result, logger } from "../../../../common";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";
import factory from "../../factory";

class CreateContentFieldDefinition {
    execute(contentFieldDefinition: ContentFieldDefinition): Result {
        factory.getContentDefinitionPersistency().createContentFieldDefinition(contentFieldDefinition);

        logger.info(`Content field definition "%s" created successfully.`, contentFieldDefinition.getName());

        return Result.success();
    }
}

export default new CreateContentFieldDefinition();
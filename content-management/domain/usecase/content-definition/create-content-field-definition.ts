import { Result, logger } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";

class CreateContentFieldDefinition {
    async execute(contentFieldDefinition: ContentFieldDefinition): Promise<Result> {
        await contentDefinitionRepository.createContentFieldDefinition(contentFieldDefinition);

        logger.info(`Content field definition "%s" created successfully.`, contentFieldDefinition.getName());

        return Result.success();
    }
}

export default new CreateContentFieldDefinition();
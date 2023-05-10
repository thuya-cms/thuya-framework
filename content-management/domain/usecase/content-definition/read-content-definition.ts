import { Result, logger } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition";

class ReadContentDefinition {
    execute(contentName: string): Result<ContentDefinition> {
        const contentDefinition = contentDefinitionRepository.readContentDefinition(contentName);

        if (!contentDefinition) {
            logger.error(`Content definition "%s" not found.`, contentName);
            return Result.error(`Content definition "${ contentName }" not found.`);
        }

        return Result.success(contentDefinition);
    }
}

export default new ReadContentDefinition();
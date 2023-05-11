import { Result, logger } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition";

class ReadContentDefinition {
    async execute(contentName: string): Promise<Result<ContentDefinition>> {
        const contentDefinition = await contentDefinitionRepository.readContentDefinition(contentName);

        if (!contentDefinition) {
            logger.error(`Content definition "%s" not found.`, contentName);
            return Result.error(`Content definition "${ contentName }" not found.`);
        }

        return Result.success(contentDefinition);
    }
}

export default new ReadContentDefinition();
import { Result } from '../../../../common';
import logger from '../../../../common/utility/logger';
import contentDefinitionRepository from '../../../repository/content-definition-repository';
import { ContentDefinition } from '../../entity/content-definition';

class CreateContentDefinition {
    execute(contentDefinition: ContentDefinition): Result {
        contentDefinitionRepository.createContentDefinition(contentDefinition);

        logger.info(`Content definition "%s" created successfully.`, contentDefinition.getName());

        return Result.success();
    }
}

export default new CreateContentDefinition();
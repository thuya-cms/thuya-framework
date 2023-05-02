import { Result } from '../../../../common';
import logger from '../../../../common/utility/logger';
import { ContentDefinition } from '../../entity/content-definition';
import factory from '../../factory';

class CreateContentDefinition {
    execute(contentDefinition: ContentDefinition): Result {
        factory.getContentDefinitionPersistency().createContentDefinition(contentDefinition);

        logger.info(`Content definition "%s" created successfully.`, contentDefinition.getName());

        return Result.success();
    }
}

export default new CreateContentDefinition();
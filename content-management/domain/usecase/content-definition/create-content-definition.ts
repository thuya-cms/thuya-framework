import logger from '../../../../common/utility/logger';
import { ContentDefinition } from '../../entity/content-definition';
import factory from '../../factory';

class CreateContentDefinition {
    execute(contentDefinition: ContentDefinition<any>) {
        factory.getPersistency().createContentDefinition(contentDefinition);

        logger.info(`Content definition "%s" created successfully.`, contentDefinition.getName());
    }
}

export default new CreateContentDefinition();
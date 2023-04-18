import logger from '../../../util/logger';
import { ContentDefinition } from '../entity/content-definition';
import factory from '../factory';

class CreateContentDefinition {
    execute(contentDefinition: ContentDefinition<any>) {
        factory.getPersistency().createContentDefinition(contentDefinition);

        logger.info(`Content definition '${ contentDefinition.getName() }' created successfully.`);
    }
}

export default new CreateContentDefinition();
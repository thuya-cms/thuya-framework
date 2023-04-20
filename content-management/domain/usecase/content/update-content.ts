import expressHelper from "../../../../common/utility/express-helper";
import logger from "../../../../util/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

class UpdateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T) {
        try {
            expressHelper.deleteNotExistingProperties(content, contentDefinition);
            contentDefinition.getContentFields().forEach(contentField => {
                let fieldValue = expressHelper.getFieldValue(contentField, contentDefinition.getName(), content);
                contentField.validateValue(fieldValue);
            });
    
            factory.getPersistency().updateContent(contentDefinition.getName(), content);

            logger.info(`Content of type '${ contentDefinition.getName() }' is updated successfully.`);
        }

        catch (error: any) {
            logger.error(error.message);
            
            throw error;
        }
    }
}
export default new UpdateContent();
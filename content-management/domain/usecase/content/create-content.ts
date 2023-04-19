import moment from "moment";
import IdentifiableError from "../../../../identitfiable-error";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import { ContentFieldDefinition, ContentFieldType } from "../../entity/content-field-definition";
import logger from "../../../../util/logger";
import expressHelper from "../../../../common/utility/express-helper";

enum ErrorCode {
    InvalidNumber = "invalid-number",
    InvalidDate = "invalid-date"
}

class CreateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T): string {
        try {
            expressHelper.deleteNotExistingProperties(content, contentDefinition);
            contentDefinition.getContentFields().forEach(contentField => 
                contentField.validateValue(content, contentDefinition.getName()));
    
            let id = factory.getPersistency().createContent(contentDefinition.getName(), content);

            logger.info(`Content of type '${ contentDefinition.getName() }' is created successfully.`);

            return id;
        }

        catch (error: any) {
            logger.error(error.message);
            
            throw error;
        }
    }
}

export default new CreateContent();
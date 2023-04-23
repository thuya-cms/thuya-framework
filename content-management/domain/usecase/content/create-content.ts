import moment from "moment";
import IdentifiableError from "../../../../identifiable-error";
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
            let finalContent: any = {};

            expressHelper.deleteNotExistingProperties(content, contentDefinition);
            contentDefinition.getContentFields().forEach(contentField => {
                let propertyName = expressHelper.getContentPropertyName(contentField, contentDefinition.getName(), content);
                let fieldValue = expressHelper.getFieldValue(contentField, contentDefinition.getName(), content);
                contentField.validateValue(fieldValue);
                fieldValue = contentField.updateValue(fieldValue);

                if (propertyName)
                    finalContent[propertyName] = fieldValue;
            });
    
            let id = factory.getPersistency().createContent(contentDefinition.getName(), finalContent);

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
import { ContentDefinition } from "../../entity/content-definition";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";
import factory from "../../factory";
import logger from "../../../../common/utility/logger";
import expressHelper from "../../../../common/utility/express-helper";
import IdentifiableError from "../../../../common/identifiable-error";
import contentManager from "../../../app/content-manager";

enum ErrorCode {
    Required = "required",
    NotUnique = "not-unique"
}

class CreateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T): string {
        let finalContent: any = {};

        expressHelper.deleteNotExistingProperties(content, contentDefinition);

        contentDefinition.getContentFields().forEach(contentField => {
            let fieldValue = expressHelper.getFieldValue(contentField.name, content);
            
            if (contentField.options.isRequired && !fieldValue) {
                logger.debug(`Value for field "%s" is required.`, contentField.name);
                throw new IdentifiableError(ErrorCode.Required, `Value for field ${ contentField.name } is required.`);
            }

            if (contentField.options.isUnique) 
                this.validateUniqueness(contentDefinition, contentField, fieldValue);

            contentField.contentFieldDefinition.validateValue(fieldValue.bind(contentField.contentFieldDefinition));
            fieldValue = contentField.contentFieldDefinition.executeDeterminations(fieldValue.bind(contentField.contentFieldDefinition));

            finalContent[contentField.name] = fieldValue;

            logger.debug(`Value "%s" for field "%s" is valid.`, fieldValue, contentField.name);
        });

        let id = factory.getPersistency().createContent(contentDefinition.getName(), finalContent);

        logger.info(`Content of type "%s" is created successfully.`, contentDefinition.getName());

        return id;
    }

    
    private validateUniqueness(contentDefinition: ContentDefinition<T>, contentField: { name: string; contentFieldDefinition: ContentFieldDefinition; options: { isRequired?: boolean | undefined; isUnique?: boolean | undefined; }; }, fieldValue: any) {
        let duplicate: any;

        try {
            duplicate = contentManager.readContentByFieldValue(contentDefinition.getName(), { name: contentField.name, value: fieldValue });
        }

        catch (error) {
            duplicate = undefined; // No duplicate.
        }

        if (duplicate) {
            logger.debug(`Value of field "%s" is not unique.`, contentField.name);
            throw new IdentifiableError(ErrorCode.NotUnique, `Value of field ${contentField.name} is not unique.`);
        }

        logger.debug(`Value of field "%s" is unique.`, contentField.name);
    }
}

export default new CreateContent();
export { ErrorCode };
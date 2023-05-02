import expressHelper from "../../../../common/utility/express-helper";
import logger from "../../../../common/utility/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import contentManager from "../../../app/content-manager";
import { ContentFieldType } from "../../entity/content-field-definition/content-field-definition";
import contentHelper from "../../../../common/utility/content-helper";
import { Result } from "../../../../common";

enum ErrorCode {
    Required = "required",
    NotUnique = "not-unique"
}

class UpdateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T): Result {
        const finalContent: any = {};

        expressHelper.deleteNotExistingProperties(
            content, 
            contentDefinition.getContentFields().map(contentField => contentField.name));

        for (const contentField of contentDefinition.getContentFields()) {
            let fieldValue = contentHelper.getFieldValue(contentField.name, content);

            if (contentField.options.isRequired && !fieldValue) {
                logger.debug(`Value for field "%s" is required.`, contentField.name);
                return Result.error(`Value for field ${ contentField.name } is required.`);
            }

            if (fieldValue) {
                if (contentField.options.isUnique) {
                    const uniquenessResult = this.validateUniqueness(contentDefinition, contentField.name, fieldValue);
                    if (uniquenessResult.getIsFailing()) 
                        return Result.error(uniquenessResult.getMessage());
                }
    
                const validationResult = contentField.contentFieldDefinition.validateValue(fieldValue);
                if (validationResult.getIsFailing())
                    return Result.error(validationResult.getMessage());

                fieldValue = contentField.contentFieldDefinition.executeDeterminations(fieldValue);

                finalContent[contentField.name] = fieldValue;
                logger.debug(`Setting value "%s" for field "%s".`, fieldValue, contentField.name);
            } else {
                if (contentField.contentFieldDefinition.getType() === ContentFieldType.Group) {
                    const validationResult = contentField.contentFieldDefinition.validateValue({});
                    if (validationResult.getIsFailing())
                        return Result.error(validationResult.getMessage());
                }

                logger.debug(`No value provided for field "%s".`, contentField.name);
            }
        }

        factory.getContentPersistency().updateContent(contentDefinition.getName(), finalContent);
        logger.info(`Content of type "%s" is created successfully.`, contentDefinition.getName());

        return Result.success();
    }


    private validateUniqueness(contentDefinition: ContentDefinition<T>, fieldName: string, fieldValue: any): Result {
        const readContentResult = contentManager.readContentByFieldValue(contentDefinition.getName(), { name: fieldName, value: fieldValue });

        if (readContentResult.getIsSuccessful()) {
            logger.debug(`Value of field "%s" is unique.`, fieldName);
            return Result.success();
        } else {
            logger.debug(`Value of field "%s" is not unique.`, fieldName);
            return Result.error(`Value of field ${fieldName} is not unique.`);
        }
    }
}

export default new UpdateContent();
export { ErrorCode };
import { Result, contentHelper, expressHelper, logger } from "../../../../../common";
import { contentManager } from "../../../../app";
import { ContentDefinition } from "../../../entity/content-definition";
import { ContentFieldType } from "../../../entity/content-field-definition/content-field-definition";

class ModifyHelper<T> {
    async convertData(contentDefinition: ContentDefinition<T>, content: T): Promise<Result<T>> {
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
                    const uniquenessResult = await this.validateUniqueness(contentDefinition, contentField.name, fieldValue);
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

        return Result.success(finalContent);
    }


    private async validateUniqueness(contentDefinition: ContentDefinition<T>, fieldName: string, fieldValue: any): Promise<Result> {
        logger.debug(`Validating uniqueness of field "%s" with value "%s".`, fieldName, fieldValue);
        const readContentResult = await contentManager.readContentByFieldValue(contentDefinition.getName(), { name: fieldName, value: fieldValue });

        if (readContentResult.getIsSuccessful()) {
            logger.debug(`Value "%s" of field "%s" is not unique.`, fieldValue, fieldName);
            return Result.error(`Value "${ fieldValue }" of field ${fieldName} is not unique.`);
        } else {
            logger.debug(`Value of field "%s" is unique.`, fieldName);
            return Result.success();
        }
    }
}

export default new ModifyHelper();
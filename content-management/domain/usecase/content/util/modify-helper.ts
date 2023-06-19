import { Result, contentHelper, Logger } from "../../../../../common";
import { contentManager } from "../../../../app";
import { ContentDefinition } from "../../../entity/content-definition/content-definition";
import { ContentFieldType } from "../../../entity/content-field-definition/content-field-definition";

/**
 * Helper class to modify content.
 */
class ModifyHelper<T> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ModifyHelper.name);
    }



    /**
     * Convert the input data into a data that meets the requirements of the content definition 
     * and validate the values.
     * 
     * @param contentDefinition the content definition of the content
     * @param content the content data
     * @returns result containing the converted data
     */
    async convertAndValidateData(contentDefinition: ContentDefinition<T>, content: T): Promise<Result<T>> {
        const finalContent: any = {};

        contentHelper.deleteNotExistingProperties(
            content, 
            contentDefinition.getContentFields().map(contentField => contentField.name));

        for (const contentField of contentDefinition.getContentFields()) {
            let fieldValue = contentHelper.getFieldValue(contentField.name, content);

            const isRequiredValidationResult = contentHelper.validateRequiredField(contentField.options.isRequired || false, fieldValue, contentField.name);
            if (isRequiredValidationResult.getIsFailing())
                return Result.error(isRequiredValidationResult.getMessage());

            if (fieldValue || fieldValue === 0) {
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
                this.logger.debug(`Setting value "%s" for field "%s".`, fieldValue, contentField.name);
            } else {
                if (contentField.contentFieldDefinition.getType() === ContentFieldType.Group) {
                    const validationResult = contentField.contentFieldDefinition.validateValue({});
                    if (validationResult.getIsFailing())
                        return Result.error(validationResult.getMessage());
                }

                this.logger.debug(`No value provided for field "%s".`, contentField.name);
            }
        }

        return Result.success(finalContent);
    }


    private async validateUniqueness(contentDefinition: ContentDefinition<T>, fieldName: string, fieldValue: any): Promise<Result> {
        this.logger.debug(`Validating uniqueness of field "%s" with value "%s".`, fieldName, fieldValue);
        const readContentResult = await contentManager.readContentByFieldValue(contentDefinition.getName(), { name: fieldName, value: fieldValue });

        if (readContentResult.getIsSuccessful()) {
            this.logger.debug(`Value "%s" of field "%s" is not unique.`, fieldValue, fieldName);
            return Result.error(`Value "${ fieldValue }" of field ${fieldName} is not unique.`);
        } else {
            this.logger.debug(`Value of field "%s" is unique.`, fieldName);
            return Result.success();
        }
    }
}

export default new ModifyHelper();
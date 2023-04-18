import moment from "moment";
import IdentifiableError from "../../../identitfiable-error";
import { ContentDefinition } from "../entity/content-definition";
import factory from "../factory";
import { ContentFieldDefinition, ContentFieldType } from "../entity/content-field-definition";
import logger from "../../../util/logger";

enum ErrorCode {
    InvalidNumber = "invalid-number",
    InvalidDate = "invalid-date"
}

class CreateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T): string {
        try {
            let persistency = factory.getPersistency();
    
            this.deleteNotExistingProperties(content, contentDefinition);
            this.validateContentData(contentDefinition, content);
    
            let id = persistency.createContent(contentDefinition.getName(), content);

            logger.info(`Content of type '${ contentDefinition.getName() }' is created successfully.`);

            return id;
        }

        catch (error: any) {
            logger.error(error.message);
            
            throw error;
        }
    }


    private validateContentData(contentDefinition: ContentDefinition<T>, content: T) {
        contentDefinition.getContentFields().forEach(contentField => {
            let fieldValue: any;

            switch (contentField.getType()) {
                case ContentFieldType.Text:
                    break;

                case ContentFieldType.Numeric:
                    fieldValue = this.getFieldValue(contentField, contentDefinition.getName(), content);

                    if (Number.isNaN(Number(fieldValue))) {
                        logger.error(`Invalid number: ${fieldValue}.`);
                        throw new IdentifiableError(ErrorCode.InvalidNumber, "Provided value is not a number.");
                    }

                    break;

                case ContentFieldType.Date:
                    fieldValue = this.getFieldValue(contentField, contentDefinition.getName(), content);

                    if (moment(fieldValue).isValid()) {
                        logger.error(`Invalid date: ${fieldValue}.`);
                        throw new IdentifiableError(ErrorCode.InvalidDate, "Provided value is not a date.");
                    }

                    break;

                default:
                    throw new Error("Assert: invalid field type.");
            }
        });
    }

    private getFieldValue(contentField: ContentFieldDefinition, contentName: string, content: T) {
        let fieldNameLowerCase = this.adjustContentFieldName(contentField, contentName);
        let propertyNameAsKey: keyof typeof content | undefined;

        for (const contentProperty in content) {
            if (contentProperty.toLowerCase() === fieldNameLowerCase) {
                propertyNameAsKey = contentProperty;
                break;
            }
        }  

        if (!propertyNameAsKey)
            return undefined;

        return content[propertyNameAsKey];
    }

    private deleteNotExistingProperties(content: T, contentDefinition: ContentDefinition<T>) {
        for (const contentProperty in content) {
            if (!this.contentFieldExists(contentDefinition, contentProperty))
                delete content[contentProperty];
        }
    }

    /**
     * Check if a content property exists as a content field in the content definition.
     * 
     * @param contentDefinition the content definition
     * @param contentProperty the property in the content to check
     * @returns true if the property exists as a content field
     */
    private contentFieldExists(contentDefinition: ContentDefinition<T>, contentProperty: Extract<keyof T, string>) {
        let contentFields = contentDefinition.getContentFields();

        return contentFields.find(contentField => this.adjustContentFieldName(contentField, contentDefinition.getName()) === contentProperty.toLowerCase());
    }

    private adjustContentFieldName(contentField: ContentFieldDefinition, contentName: string) {
        return contentField.getName().toLowerCase()
            .replace(contentName, "")
            .replace(/-/g, "");
    }
}

export default new CreateContent();
import Result from "../result";
import Logger from "./logger";

/**
 * Helper class for content maintenance.
 */
class ContentHelper {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ContentHelper.name);
    }

    
    
    /**
     * Get the value of a field from an object.
     * 
     * @param fieldName name of the field
     * @param content the content
     * @returns the value of the field from content
     */
    getFieldValue(fieldName: string, content: any): any {
        const propertyNameAsKey: keyof any = fieldName;

        return content[propertyNameAsKey];
    }

    /**
     * Delete properties from a content that are not included in the array of content field names.
     * 
     * @param content the content
     * @param contentFieldNames array of content field names
     */
    deleteNotExistingProperties(content: any, contentFieldNames: string[]): void {
        for (const contentProperty in content) {
            if (!this.contentFieldExists(contentFieldNames, contentProperty)) {
                delete content[contentProperty];
                this.logger.debug(`Field "%s" is removed.`, contentProperty);
            }
        }
    }

    /**
     * Validate the value for a required field.
     * 
     * @param isRequired is required indicator
     * @param fieldValue value of the content field
     * @param contentFieldName name of the content field
     * @returns result
     */
    validateRequiredField(isRequired: boolean, fieldValue: any, contentFieldName: string): Result {
        if (isRequired && !fieldValue && fieldValue !== 0) {
            this.logger.debug(`Value for field "%s" is required.`, contentFieldName);
            return Result.error(`Value for field ${ contentFieldName } is required.`);
        }

        return Result.success();
    }
        
    
    private contentFieldExists(contentFieldNames: string[], contentProperty: Extract<keyof any, string>): boolean {
        return !contentFieldNames.find(contentFieldName => contentFieldName === contentProperty);
    }
}

export default new ContentHelper();
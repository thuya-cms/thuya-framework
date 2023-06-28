import { Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents text.
 */
class BooleanContentFieldDefinition extends ContentFieldDefinition<boolean> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Boolean, filePath);
    }



    /**
     * Create a new instance of a text content field definition.
     * 
     * @param id id of the content field definition
     * @param name name of the content field definition
     * @param filePath the path of the content field definition implementation
     * @returns an instance of a new content field definition
     */
    static create(id: string, name: string, filePath?: string): Result<BooleanContentFieldDefinition> {
        try {
            const contentFieldDefinition = new BooleanContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    /**
     * @inheritdoc
     */
    override validateValue(fieldValue: boolean): Result {
        if (fieldValue.toString() !== "false" && fieldValue.toString() !== "true") {
            this.logger.debug(`Invalid boolean value "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid boolean value "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default BooleanContentFieldDefinition;
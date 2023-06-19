import { Logger, Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents an array.
 */
class ArrayContentFieldDefinition<T = any> extends ContentFieldDefinition<T[]> {    
    protected constructor(id: string, name: string, private arrayElementType: ContentFieldDefinition, filePath?: string) {
        super(id, name, ContentFieldType.Array, filePath);
        this.logger = Logger.for(ArrayContentFieldDefinition.name);
    }



    /**
     * Create a new instance of an array content field definition.
     * 
     * @param id id of the content field definition
     * @param name name of the content field definition
     * @param arrayElementType type of the array elements
     * @param filePath the path of the content field definition implementation
     * @returns an instance of a new content field definition
     */
    static create(id: string, name: string, arrayElementType: ContentFieldDefinition, filePath?: string): Result<ArrayContentFieldDefinition> {
        try {
            const contentFieldDefinition = new ArrayContentFieldDefinition(id, name, arrayElementType, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    /**
     * @returns the type of the array elements 
     */
    getArrayElementType(): ContentFieldDefinition {
        return this.arrayElementType;
    }

    /**
     * @inheritdoc
     */
    override validateValue(fieldValue: any[]): Result {
        if (!Array.isArray(fieldValue)) {
            this.logger.debug(`Invalid array value "%s" for "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid array value "${ fieldValue }" for "${ this.getName() }".`);
        }

        for (const arrayElementValue of fieldValue) {
            const result = this.arrayElementType.validateValue(arrayElementValue);
    
            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
}

export default ArrayContentFieldDefinition;
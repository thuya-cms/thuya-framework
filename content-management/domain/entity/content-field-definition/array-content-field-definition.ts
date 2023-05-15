import { Result } from "../../../../common";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";
import { ContentFieldValue } from "./content-field-handler-provider.interface";

class ArrayContentFieldDefinition extends ContentFieldDefinition {    
    protected constructor(id: string, name: string, private arrayElementType: ContentFieldDefinition, filePath?: string) {
        super(id, name, ContentFieldType.Array, filePath);
    }



    static create(id: string, name: string, arrayElementType: ContentFieldDefinition, filePath?: string): Result<ArrayContentFieldDefinition> {
        try {
            const contentFieldDefinition = new ArrayContentFieldDefinition(id, name, arrayElementType, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    getArrayElementType(): ContentFieldDefinition {
        return this.arrayElementType;
    }

    override validateValue(fieldValue: ContentFieldValue): Result<void> {
        if (!Array.isArray(fieldValue)) {
            logger.debug(`Invalid array value "%s" for "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid array value "${ fieldValue }" for "${ this.getName() }".`);
        }

        const array: any[] = fieldValue;

        for (const arrayElementValue of array) {
            const result = this.arrayElementType.validateValue(arrayElementValue);
    
            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
}

export default ArrayContentFieldDefinition;
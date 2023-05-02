import { Result } from "../../../../common";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

class ArrayContentFieldDefinition extends ContentFieldDefinition {    
    protected constructor(id: string, name: string, private arrayElementType: ContentFieldDefinition) {
        super(id, name, ContentFieldType.Array);
    }



    static create(id: string, name: string, arrayElementType: ContentFieldDefinition): Result<ArrayContentFieldDefinition> {
        try {
            let contentFieldDefinition = new ArrayContentFieldDefinition(id, name, arrayElementType);
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

        let array: any[] = fieldValue;

        array.forEach(arrayElementValue => {
            let result = this.arrayElementType.validateValue(arrayElementValue);

            if (result.getIsFailing()) return result;
        });
        
        return super.validateValue(fieldValue);
    }
}

export default ArrayContentFieldDefinition;
import IdentifiableError from "../../../../identifiable-error";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

enum ErrorCode {
    InvalidArray = "invalid-array"
}

class ArrayContentFieldDefinition extends ContentFieldDefinition {    
    constructor(id: string, name: string, private arrayElementType: ContentFieldDefinition) {
        super(id, name, ContentFieldType.Array);
    }



    getArrayElementType(): ContentFieldDefinition {
        return this.arrayElementType;
    }

    override validateValue(fieldValue: ContentFieldValue): void {
        if (!Array.isArray(fieldValue)) {
            logger.error(`Invalid array: ${fieldValue}.`);
            throw new IdentifiableError(ErrorCode.InvalidArray, "Provided value is not an array.");
        }

        let array: any[] = fieldValue;

        array.forEach(arrayElementValue => {
            this.arrayElementType.validateValue(arrayElementValue);
        });
        
        super.validateValue(fieldValue);
    }
}

export { ArrayContentFieldDefinition, ErrorCode };
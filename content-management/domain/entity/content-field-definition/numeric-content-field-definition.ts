import IdentifiableError from "../../../../common/identifiable-error";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

enum ErrorCode {
    InvalidNumber = "invalid-number"
}

class NumericContentFieldDefinition extends ContentFieldDefinition {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Numeric);
    }

    

    override validateValue(fieldValue: ContentFieldValue): void {
        if (Number.isNaN(Number(fieldValue))) {
            logger.error(`Invalid number: ${fieldValue}.`);
            throw new IdentifiableError(ErrorCode.InvalidNumber, "Provided value is not a number.");
        }
        
        super.validateValue(fieldValue);
    }
}

export { NumericContentFieldDefinition, ErrorCode };
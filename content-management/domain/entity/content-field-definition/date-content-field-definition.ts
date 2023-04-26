import moment from "moment";
import IdentifiableError from "../../../../common/identifiable-error";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

enum ErrorCode {
    InvalidDate = "invalid-date"
}

class DateContentFieldDefinition extends ContentFieldDefinition {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Date);
    }

    

    override validateValue(fieldValue: ContentFieldValue): void {
        if (Array.isArray(fieldValue))
            throw new IdentifiableError(ErrorCode.InvalidDate, "Provided value is not a date.");

        if (moment(fieldValue).isValid()) {
            logger.error(`Invalid date: ${fieldValue}.`);
            throw new IdentifiableError(ErrorCode.InvalidDate, "Provided value is not a date.");
        }
        
        super.validateValue(fieldValue);
    }
}

export { DateContentFieldDefinition, ErrorCode };
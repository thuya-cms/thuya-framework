import moment from "moment";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";
import { Result } from "../../../../common";

class DateContentFieldDefinition extends ContentFieldDefinition {
    protected constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Date);
    }



    static create(id: string, name: string): Result<DateContentFieldDefinition> {
        try {
            const contentFieldDefinition = new DateContentFieldDefinition(id, name);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }

    
    override validateValue(fieldValue: ContentFieldValue): Result {
        if (Array.isArray(fieldValue)) {
            logger.debug(`Invalid date "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid date "${ fieldValue }" for field "${ this.getName() }".`);
        }

        if (!moment(fieldValue).isValid()) {
            logger.debug(`Invalid date "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid date "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default DateContentFieldDefinition;
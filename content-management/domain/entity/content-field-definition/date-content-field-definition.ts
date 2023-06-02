import moment from "moment";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";
import { Logger, Result } from "../../../../common";

class DateContentFieldDefinition extends ContentFieldDefinition<Date> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Date, filePath);

        this.logger = Logger.for(DateContentFieldDefinition.toString());
    }



    static create(id: string, name: string, filePath?: string): Result<DateContentFieldDefinition> {
        try {
            const contentFieldDefinition = new DateContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }

    
    override validateValue(fieldValue: Date): Result {
        if (!moment(fieldValue).isValid()) {
            this.logger.debug(`Invalid date "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid date "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default DateContentFieldDefinition;
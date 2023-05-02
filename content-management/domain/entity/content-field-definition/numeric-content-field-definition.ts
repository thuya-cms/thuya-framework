import { Result } from "../../../../common";
import logger from "../../../../common/utility/logger";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

class NumericContentFieldDefinition extends ContentFieldDefinition {
    protected constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Numeric);
    }



    static create(id: string, name: string): Result<NumericContentFieldDefinition> {
        try {
            const contentFieldDefinition = new NumericContentFieldDefinition(id, name);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    override validateValue(fieldValue: ContentFieldValue): Result {
        if (Number.isNaN(Number(fieldValue))) {
            logger.debug(`Invalid numeric value "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid numeric value "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default NumericContentFieldDefinition;
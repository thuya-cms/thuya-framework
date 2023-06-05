import { Logger, Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

class NumericContentFieldDefinition extends ContentFieldDefinition<number> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Numeric, filePath);

        this.logger = Logger.for(NumericContentFieldDefinition.name);
    }



    static create(id: string, name: string, filePath?: string): Result<NumericContentFieldDefinition> {
        try {
            const contentFieldDefinition = new NumericContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    override validateValue(fieldValue: number): Result {
        if (Number.isNaN(Number(fieldValue))) {
            this.logger.debug(`Invalid numeric value "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid numeric value "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default NumericContentFieldDefinition;
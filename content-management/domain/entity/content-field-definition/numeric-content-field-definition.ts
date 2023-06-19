import { Logger, Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition tat represents numbers.
 */
class NumericContentFieldDefinition extends ContentFieldDefinition<number> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Numeric, filePath);

        this.logger = Logger.for(NumericContentFieldDefinition.name);
    }



    /**
     * Create a new instance of a numeric content field definition.
     * 
     * @param id id of the content field definition
     * @param name name of the content field definition
     * @param filePath the path of the content field definition implementation
     * @returns an instance of a new content field definition
     */
    static create(id: string, name: string, filePath?: string): Result<NumericContentFieldDefinition> {
        try {
            const contentFieldDefinition = new NumericContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    /**
     * @inheritdoc
     */
    override validateValue(fieldValue: number): Result {
        if (Number.isNaN(Number(fieldValue))) {
            this.logger.debug(`Invalid numeric value "%s" for field "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid numeric value "${ fieldValue }" for field "${ this.getName() }".`);
        }
        
        return super.validateValue(fieldValue);
    }
}

export default NumericContentFieldDefinition;
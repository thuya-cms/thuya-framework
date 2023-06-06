import { Logger, Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

class ArrayContentFieldDefinition<T = any> extends ContentFieldDefinition<T[]> {    
    protected constructor(id: string, name: string, private arrayElementType: ContentFieldDefinition, filePath?: string) {
        super(id, name, ContentFieldType.Array, filePath);
        this.logger = Logger.for(ArrayContentFieldDefinition.name);
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

    override validateValue(fieldValue: any[]): Result<void> {
        if (!Array.isArray(fieldValue)) {
            this.logger.debug(`Invalid array value "%s" for "%s".`, fieldValue, this.getName());
            return Result.error(`Invalid array value "${ fieldValue }" for "${ this.getName() }".`);
        }

        for (const arrayElementValue of fieldValue) {
            const result = this.arrayElementType.validateValue(arrayElementValue);
    
            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
}

export default ArrayContentFieldDefinition;
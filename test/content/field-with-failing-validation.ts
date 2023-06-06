import { Result } from "../../common";
import TextContentFieldDefinitionDTO from "../../content-management/app/dto/content-field-definition/text-content-field-definition";

class FieldWithFailingValidation extends TextContentFieldDefinitionDTO {
    protected filePath: string = __filename;


    constructor() {
        super("", "failing-validation");
        
        this.addValidator((data) => {
            return Result.error(`Validation failed with data ${ data }.`);
        });
    }
}

export default new FieldWithFailingValidation();
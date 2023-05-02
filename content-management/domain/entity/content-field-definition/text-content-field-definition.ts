import { Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

class TextContentFieldDefinition extends ContentFieldDefinition {
    protected constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Text);
    }



    static create(id: string, name: string): Result<TextContentFieldDefinition> {
        try {
            let contentFieldDefinition = new TextContentFieldDefinition(id, name);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }
}

export default TextContentFieldDefinition;
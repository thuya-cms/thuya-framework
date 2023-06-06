import { Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

class TextContentFieldDefinition extends ContentFieldDefinition<string> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Text, filePath);
    }



    static create(id: string, name: string, filePath?: string): Result<TextContentFieldDefinition> {
        try {
            const contentFieldDefinition = new TextContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }
}

export default TextContentFieldDefinition;
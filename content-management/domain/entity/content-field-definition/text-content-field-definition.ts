import { Result } from "../../../../common";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents text.
 */
class TextContentFieldDefinition extends ContentFieldDefinition<string> {
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Text, filePath);
    }



    /**
     * Create a new instance of a text content field definition.
     * 
     * @param id id of the content field definition
     * @param name name of the content field definition
     * @param filePath the path of the content field definition implementation
     * @returns an instance of a new content field definition
     */
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
import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents text.
 */
class TextContentFieldDefinitionDTO extends ContentFieldDefinitionDTO<string> {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Text);
    }
}

export default TextContentFieldDefinitionDTO;
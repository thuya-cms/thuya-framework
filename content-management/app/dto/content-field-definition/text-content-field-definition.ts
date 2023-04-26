import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

class TextContentFieldDefinitionDTO extends ContentFieldDefinitionDTO {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Text);
    }
}

export default TextContentFieldDefinitionDTO;
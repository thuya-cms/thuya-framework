import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

class TextContentFieldDefinition extends ContentFieldDefinition {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Text);
    }
}

export default TextContentFieldDefinition;
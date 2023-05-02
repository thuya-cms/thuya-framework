import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";

class IdContentFieldDefinition extends TextContentFieldDefinition {
    public constructor() {
        super("", "id");
    }
}

export default new IdContentFieldDefinition();
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";

/**
 * Content field for ids. 
 * This is used automatically by all content definitions for field "id".
 */
class IdContentFieldDefinition extends TextContentFieldDefinition {
    public constructor() {
        super("", "id");
    }
}

export default new IdContentFieldDefinition();
import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents boolean value.
 */
class BooleanContentFieldDefinitionDTO extends ContentFieldDefinitionDTO<boolean> {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Boolean);
    }
}

export default BooleanContentFieldDefinitionDTO;
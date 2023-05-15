import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

class NumericContentFieldDefinitionDTO extends ContentFieldDefinitionDTO<number> {
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Numeric);
    }
}

export default NumericContentFieldDefinitionDTO;
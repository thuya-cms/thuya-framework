import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

class ArrayContentFieldDefinitionDTO extends ContentFieldDefinitionDTO {    
    constructor(id: string, name: string, private arrayElementType: ContentFieldDefinitionDTO) {
        super(id, name, ContentFieldType.Array);
    }



    getArrayElementType(): ContentFieldDefinitionDTO {
        return this.arrayElementType;
    }
}

export default ArrayContentFieldDefinitionDTO;
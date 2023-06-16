import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

/**
 * Content field definition that represents an array.
 */
class ArrayContentFieldDefinitionDTO<T = any> extends ContentFieldDefinitionDTO<T[]> {    
    constructor(id: string, name: string, private arrayElementType: ContentFieldDefinitionDTO) {
        super(id, name, ContentFieldType.Array);
    }



    /**
     * @returns the type of the array elements 
     */
    getArrayElementType(): ContentFieldDefinitionDTO {
        return this.arrayElementType;
    }
}

export default ArrayContentFieldDefinitionDTO;
import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean
}

class GroupContentFieldDefinitionDTO<T = any> extends ContentFieldDefinitionDTO<T> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] = [];

    
    
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Group);
    }



    addContentField(name: string, contentField: ContentFieldDefinitionDTO, options?: ContentFieldOptions) {
        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export default GroupContentFieldDefinitionDTO;
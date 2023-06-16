import { ContentFieldDefinitionDTO, ContentFieldType } from "./content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean
}

/**
 * Content field definition that represents a group of content fields.
 */
class GroupContentFieldDefinitionDTO<T = any> extends ContentFieldDefinitionDTO<T> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] = [];

    
    
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Group);
    }



    /**
     * Add a new content field to the group.
     * 
     * @param name name of the content field
     * @param contentFieldDefinition the content field definition
     * @param options options for the content field
     */
    addContentField(name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options?: ContentFieldOptions): void {
        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentFieldDefinition,
            options: options || {}
        });
    }

    /**
     * @returns the content fields of the group 
     */
    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentFieldOptions };
export default GroupContentFieldDefinitionDTO;
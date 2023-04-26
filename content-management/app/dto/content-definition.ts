import idContentFieldDefinition from "../../content/id-content-field-definition";
import { ContentFieldDefinitionDTO } from "./content-field-definition/content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean
}

class ContentDefinitionDTO<T> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] = [];



    constructor(private id: string, private name: string) {}



    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
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

export default ContentDefinitionDTO;
import { ContentFieldDefinitionDTO } from "./content-field-definition/content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ContentDefinitionDTO<T = any> {
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
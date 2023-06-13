import { ContentFieldDefinitionDTO } from "./content-field-definition/content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean,
    isIndexed?: boolean
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

    clone(id?: string): ContentDefinitionDTO<T> {
        const newId = id || this.getId();

        const contentDefinition = new ContentDefinitionDTO(newId, this.getName());

        for (const contentField of this.getContentFields()) {
            contentDefinition.addContentField(contentField.name, contentField.contentFieldDefinition, contentField.options); // TODO: Clone fields.
        }

        return contentDefinition;
    }
}

export default ContentDefinitionDTO;
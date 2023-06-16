import { ContentFieldDefinitionDTO } from "../content-field-definition/content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean,
    isIndexed?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Content definition.
 */
class ContentDefinitionDTO<T = any> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] = [];



    constructor(private id: string, private name: string) {}



    /**
     * @returns the id of the content definition.
     */
    getId(): string {
        return this.id;
    }

    /**
     * @returns the name of the content definition
     */
    getName(): string {
        return this.name;
    }

    /**
     * Add a content field to the content definition.
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
     * @returns the list of content fields 
     */
    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinitionDTO, options: ContentFieldOptions }[] {
        return this.contentFields;
    }

    /**
     * Clone the current {@link ContentDefinition}.
     * 
     * @param id new id for the content definition
     * @returns a clone of the content definition
     */
    clone(id?: string): ContentDefinitionDTO<T> {
        const newId = id || this.getId();

        const contentDefinition = new ContentDefinitionDTO(newId, this.getName());

        for (const contentField of this.getContentFields()) {
            contentDefinition.addContentField(contentField.name, contentField.contentFieldDefinition, contentField.options); // TODO: Clone fields.
        }

        return contentDefinition;
    }
}

export { ContentFieldOptions };
export default ContentDefinitionDTO;
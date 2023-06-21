import Entity from "../../../../common/entity";
import { ContentFieldDefinition } from "../content-field-definition/content-field-definition";
import idContentFieldDefinition from "../../../content/id-content-field-definition";
import { Result, Logger } from "../../../../common";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean,
    isIndexed?: boolean,
    isImmutable?: boolean
}

/**
 * Defines a the structure and rules of a content.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ContentDefinition<T = any> extends Entity {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];
    private logger: Logger;



    protected constructor(id: string, private name: string) {
        super(id);
        
        this.logger = Logger.for(ContentDefinition.name);

        if (!name) {
            this.logger.error(`Content definition name is required.`);
            throw new Error("Content definition name is required.");
        }

        if (!this.getContentFields().find(contentField => contentField.contentFieldDefinition.getName() === "id"))
            this.addContentField("id", idContentFieldDefinition, { isUnique: true, isImmutable: true });
    }



    /**
     * Create a new content definition.
     * 
     * @param id id of the content definition
     * @param name name of the content definition
     * @returns result containing the new instance of a content definition
     */
    public static create<T>(id: string, name: string): Result<ContentDefinition<T>> {
        try {
            return Result.success(new ContentDefinition<T>(id, name));
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    /**
     * @returns name of the content definition 
     */
    getName(): string {
        return this.name;
    }

    /**
     * Add a content field to the content definition.
     * 
     * @param name name of the content field
     * @param contentFieldDefinition the content field definition
     * @param options content field options
     * @returns result
     * @todo cleanup id handling
     */
    addContentField(name: string, contentFieldDefinition: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (name === "id" && this.contentFields.find(existingContentField => existingContentField.name === "id")) {
            this.logger.debug(`Field "id" is already added.`);
            return Result.success();
        }

        if (this.contentFields.findIndex(existingContentField => existingContentField.name === name) !== -1) {
            this.logger.error(`Field with name "%s" is already added.`, name);
            return Result.error(`Field with name "${ name }" is already added.`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentFieldDefinition,
            options: options || {}
        });

        this.logger.debug(`Field "%s" is added to "%s".`, name, this.getName());
        return Result.success();
    }

    /**
     * @returns the content fields of the content definition
     */
    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentDefinition };
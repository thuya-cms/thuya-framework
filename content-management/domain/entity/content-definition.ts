import Entity from "../../../common/entity";
import { ContentFieldDefinition } from "./content-field-definition/content-field-definition";
import idContentFieldDefinition from "../../content/id-content-field-definition";
import { Result, Logger } from "../../../common";

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean,
    isIndexed?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ContentDefinition<T = any> extends Entity {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];
    private logger: Logger;



    protected constructor(id: string, private name: string) {
        super(id);
        
        this.logger = Logger.for(ContentDefinition.toString());

        if (!name) {
            this.logger.error(`Content definition name is required.`);
            throw new Error("Content definition name is required.");
        }

        if (!this.getContentFields().find(contentField => contentField.contentFieldDefinition.getName() === "id"))
            this.addContentField("id", idContentFieldDefinition);
    }



    public static create<T>(id: string, name: string): Result<ContentDefinition<T>> {
        try {
            return Result.success(new ContentDefinition<T>(id, name));
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    getName(): string {
        return this.name;
    }

    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (name === "id" && this.contentFields.find(existingContentField => existingContentField.name === "id")) {
            this.logger.debug(`Field "id" is already added.`);
            return Result.success();
        }

        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            this.logger.error(`Field with name "%s" is already added.`, name);
            return Result.error(`Field with name "${ name }" is already added.`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        this.logger.debug(`Field "%s" is added to "%s".`, name, this.getName());

        return Result.success();
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentDefinition };
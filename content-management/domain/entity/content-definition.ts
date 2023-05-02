import Entity from "../../../common/entity";
import IdentifiableError from "../../../common/identifiable-error";
import { ContentFieldDefinition } from "./content-field-definition/content-field-definition";
import idContentFieldDefinition from "../../content/id-content-field-definition";
import { Result, logger } from "../../../common";

enum ErrorCode {
    InvalidName = "invalid-name"
}

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean
}

class ContentDefinition<T = any> extends Entity {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];



    protected constructor(id: string, private name: string) {
        super(id);
        
        if (!name) {
            logger.error(`Content definition name is required.`);
            throw new IdentifiableError(ErrorCode.InvalidName, "Content definition name is required.");
        }

        this.addContentField("id", idContentFieldDefinition);
    }



    public static create<T>(id: string, name: string): Result<ContentDefinition<T>> {
        try {
            return Result.success(new ContentDefinition(id, name));
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    getName(): string {
        return this.name;
    }

    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            logger.error(`Field with name "%s" is already added.`, name);
            return Result.error(`Field with name "${ name }" is already added.`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        logger.debug(`Field "%s" is added to "%s".`, name, this.getName());

        return Result.success();
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentDefinition, ErrorCode };
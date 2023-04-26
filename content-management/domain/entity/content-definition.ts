import Entity from "../../../common/entity";
import IdentifiableError from "../../../common/identifiable-error";
import { ContentFieldDefinition } from "./content-field-definition/content-field-definition";
import idContentFieldDefinition from "../../content/id-content-field-definition";
import { logger } from "../../../common";

enum ErrorCode {
    InvalidName = "invalid-name",
    DuplicateField = "duplicate-field"
}

type ContentFieldOptions = {
    isRequired?: boolean,
    isUnique?: boolean
}

class ContentDefinition<T> extends Entity {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];



    constructor(
            id: string, 
            private name: string) {
        super(id);
        
        if (!name) {
            logger.error(`Content definition name is required.`);
            throw new IdentifiableError(ErrorCode.InvalidName, "Content definition name is required.");
        }

        this.addContentField("id", idContentFieldDefinition);
    }



    getName(): string {
        return this.name;
    }

    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions) {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            logger.error(`Field with name "%s" is already added.`, name);
            throw new IdentifiableError(ErrorCode.DuplicateField, `Field with name "${ name }" is already added.`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        logger.debug(`Field "%s" is added to "%s".`, name, this.getName());
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentDefinition, ErrorCode };
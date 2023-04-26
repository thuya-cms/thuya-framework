import Entity from "../../../common/entity";
import IdentifiableError from "../../../common/identifiable-error";
import { ContentFieldDefinition } from "./content-field-definition/content-field-definition";
import idContentFieldDefinition from "../../content/id-content-field-definition";

enum ErrorCode {
    InvalidName = "invalid-name",
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
        
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");

        this.addContentField("id", idContentFieldDefinition);
    }



    getName(): string {
        return this.name;
    }

    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions) {
        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }
}

export { ContentDefinition, ErrorCode };
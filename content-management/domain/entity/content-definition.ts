import Entity from "../../../common/entity";
import IdentifiableError from "../../../identifiable-error";
import { ContentFieldDefinition } from "./content-field-definition";
import { ContentFieldGroupDefinition } from "./content-field-group-definition";
import idContentFieldDefinition from "./id-content-field-definition";

enum ErrorCode {
    InvalidName = "invalid-name",
}

type ContentFieldOptions = {
    isRequired?: boolean
}

class ContentDefinition<T> extends Entity {
    private contentParts: ContentFieldGroupDefinition<any>[] = [];
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];
    private handlers: ((contentData: T) => void)[] = [];



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

    addContentFieldGroup(contentPart: ContentFieldGroupDefinition<any>) {
        this.contentParts.push(contentPart);
    }

    getContentFieldGroups(): ContentFieldGroupDefinition<any>[] {
        return this.contentParts;
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

    addHandler(handler: (contentData: T) => void) {
        this.handlers.push(handler);
    }

    getHandlers(): ((contentData: T) => void)[] {
        return this.handlers;
    }
}

export { ContentDefinition, ErrorCode };
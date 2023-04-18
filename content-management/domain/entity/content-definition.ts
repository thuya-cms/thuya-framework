import Entity from "../../../common/entity";
import IdentifiableError from "../../../identitfiable-error";
import { ContentFieldDefinition } from "./content-field-definition";
import { ContentFieldGroupDefinition } from "./content-field-group-definition";
import idContentFieldDefinition from "./id-content-field-definition";

enum ErrorCode {
    InvalidName = "invalid-name",
}

class ContentDefinition<T> extends Entity {
    private contentParts: ContentFieldGroupDefinition<any>[] = [];
    private contentFields: ContentFieldDefinition[] = [];
    private handlers: ((contentData: T) => void)[] = [];



    constructor(
            id: string, 
            private name: string) {
        super(id);
        
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");

        this.addContentField(idContentFieldDefinition);
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

    addContentField(contentField: ContentFieldDefinition) {
        this.contentFields.push(contentField);
    }

    getContentFields(): ContentFieldDefinition[] {
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
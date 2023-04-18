import Entity from "../../../common/entity";
import IdentifiableError from "../../../identitfiable-error";
import { ContentFieldDefinition } from "./content-field-definition";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidContentField = "invalid-content-field"
}

class ContentFieldGroupDefinition<T> extends Entity {
    private contentFields: ContentFieldDefinition[] = [];
    private handlers: ((contentFieldGroupData: T) => void)[] = [];



    constructor(id: string, private name: string) {
        super(id);
        
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");
    }



    getName(): string {
        return this.name;
    }
    
    addContentField(contentField: ContentFieldDefinition) {
        if (!contentField)
            throw new IdentifiableError(ErrorCode.InvalidContentField, "Content field cannot be undefined.");

        if (this.contentFields.find(existingField => existingField.getName() === contentField.getName()))
            throw new IdentifiableError(ErrorCode.InvalidContentField, "Content field with the same name is already assigned.");

        this.contentFields.push(contentField);
    }

    getContentFields(): ContentFieldDefinition[] {
        return this.contentFields;
    }

    addHandler(handler: (contentFieldGroupData: T) => void) {
        this.handlers.push(handler);
    }

    getHandlers(): ((contentFieldGroupData: T) => void)[] {
        return this.handlers;
    }
}

export { ContentFieldGroupDefinition, ErrorCode };
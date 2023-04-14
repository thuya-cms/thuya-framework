import IdentifiableError from "../../../identitfiable-error";
import { ContentField } from "./content-field";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidContentField = "invalid-content-field"
}

class ContentPart {
    private contentFields: ContentField[] = [];
    private handlers: ((contentPart: ContentPart) => void)[] = [];



    constructor(private id: string, private name: string) {
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");
    }



    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
    
    addContentField(contentField: ContentField) {
        if (!contentField)
            throw new IdentifiableError(ErrorCode.InvalidContentField, "Content field cannot be undefined.");

        if (this.contentFields.find(existingField => existingField.getName() === contentField.getName()))
            throw new IdentifiableError(ErrorCode.InvalidContentField, "Content field with the same name is already assigned.");

        this.contentFields.push(contentField);
    }

    getContentFields(): ContentField[] {
        return this.contentFields;
    }

    addHandler(handler: (contentPart: ContentPart) => void) {
        this.handlers.push(handler);
    }

    getHandlers(): ((contentPart: ContentPart) => void)[] {
        return this.handlers;
    }
}

export { ContentPart, ErrorCode };
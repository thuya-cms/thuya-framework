import IdentifiableError from "../../../identitfiable-error";
import { ContentField } from "./content-field";
import { ContentPart } from "./content-part";

enum ErrorCode {
    InvalidName = "invalid-name",
}

class ContentType {
    private contentParts: ContentPart[] = [];
    private contentFields: ContentField[] = [];
    private handlers: ((contentType: ContentType) => void)[] = [];



    constructor(
            private id: string, 
            private name: string) {
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");
    }



    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    addContentPart(contentPart: ContentPart) {
        this.contentParts.push(contentPart);
    }

    getContentParts(): ContentPart[] {
        return this.contentParts;
    }

    addContentField(contentField: ContentField) {
        this.contentFields.push(contentField);
    }

    getContentFields(): ContentField[] {
        return this.contentFields;
    }

    addHandler(handler: (contentType: ContentType) => void) {
        this.handlers.push(handler);
    }

    getHandlers(): ((contentType: ContentType) => void)[] {
        return this.handlers;
    }
}

export { ContentType, ErrorCode };
import IdentifiableError from "../../../identitfiable-error";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidType = "invalid-type",
    InvalidDisplayOption = "invalid-display-option"
}

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date"
}

class ContentField {
    private displayOptions: string[] = [];
    private isRequired: boolean = false;
    private handlers: ((contentField: ContentField) => void)[] = [];

    
    
    constructor(
            private id: string, 
            private name: string, 
            private type: ContentFieldType) {
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");

        if (!Object.values(ContentFieldType).includes(type))
            throw new IdentifiableError(ErrorCode.InvalidType, "Type is invalid.");
    }



    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getType(): ContentFieldType {
        return this.type;
    }

    setIsRequired(isRequired: boolean) {
        this.isRequired = isRequired;
    }

    getIsRequired(): boolean {
        return this.isRequired;
    }
    
    addDisplayOption(displayOption: string) {
        if (!displayOption || this.displayOptions.includes(displayOption))
            throw new IdentifiableError(ErrorCode.InvalidDisplayOption, "Invalid display option.");

        this.displayOptions.push(displayOption);
    }

    getDisplayOptions(): string[] {
        return this.displayOptions;
    }

    addHandler(handler: (contentField: ContentField) => void) {
        this.handlers.push(handler);
    }

    getHandlers(): ((contentField: ContentField) => void)[] {
        return this.handlers;
    }
}

export default ContentField;
import Entity from "../../../common/entity";
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

type ContentFieldTypes = string | Date | number | string[] | Date[] | number[]; 
type ContentFieldHandler = (contentFieldData: ContentFieldTypes) => void;

class ContentFieldDefinition extends Entity {
    private displayOptions: { key: string, value: any }[] = [];
    private isRequired: boolean = false;
    private handlers: ContentFieldHandler[] = [];

    
    
    constructor(
            id: string, 
            private name: string, 
            private type: ContentFieldType) {
        super(id);
        
        if (!name) 
            throw new IdentifiableError(ErrorCode.InvalidName, "Name cannot be initial.");

        if (!Object.values(ContentFieldType).includes(type))
            throw new IdentifiableError(ErrorCode.InvalidType, "Type is invalid.");
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
    
    addDisplayOption(key: string, value: any) {
        if (!key || !value || this.displayOptions.find(existingDisplayOption => existingDisplayOption.key === key))
            throw new IdentifiableError(ErrorCode.InvalidDisplayOption, "Invalid display option.");

        this.displayOptions.push({
            key: key,
            value: value
        });
    }

    getDisplayOptions(): { key: string, value: any }[] {
        return this.displayOptions;
    }

    addHandler(handler: ContentFieldHandler) {
        this.handlers.push(handler);
    }

    getHandlers(): ContentFieldHandler[] {
        return this.handlers;
    }
}

export { ContentFieldDefinition, ErrorCode, ContentFieldType, ContentFieldTypes };
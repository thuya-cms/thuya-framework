import moment from "moment";
import Entity from "../../../common/entity";
import IdentifiableError from "../../../identitfiable-error";
import logger from "../../../util/logger";
import expressHelper from "../../../common/utility/express-helper";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidType = "invalid-type",
    InvalidDisplayOption = "invalid-display-option",
    InvalidNumber = "invalid-number",
    InvalidDate = "invalid-date",
    ValueRequired = "value-required"
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

    validateValue(content: any, contentName: string) {
        let fieldValue: any = this.getFieldValue(this, contentName, content);

        if (this.isRequired && (!fieldValue || fieldValue === ""))
            throw new IdentifiableError(ErrorCode.ValueRequired, `Field '${ this.getName() }' is required.`);

        this.getHandlers().forEach(handler => {
            handler(fieldValue);
        });

        switch (this.getType()) {
            case ContentFieldType.Text:
                break;

            case ContentFieldType.Numeric:
                if (Number.isNaN(Number(fieldValue))) {
                    logger.error(`Invalid number: ${fieldValue}.`);
                    throw new IdentifiableError(ErrorCode.InvalidNumber, "Provided value is not a number.");
                }

                break;

            case ContentFieldType.Date:
                if (moment(fieldValue).isValid()) {
                    logger.error(`Invalid date: ${fieldValue}.`);
                    throw new IdentifiableError(ErrorCode.InvalidDate, "Provided value is not a date.");
                }

                break;

            default:
                throw new Error("Assert: invalid field type.");
        }
    }


    private getFieldValue(contentField: ContentFieldDefinition, contentName: string, content: any) {
        let fieldNameLowerCase = expressHelper.adjustContentFieldName(contentField, contentName);
        let propertyNameAsKey: keyof typeof content | undefined;

        for (const contentProperty in content) {
            if (contentProperty.toLowerCase() === fieldNameLowerCase) {
                propertyNameAsKey = contentProperty;
                break;
            }
        }  

        if (!propertyNameAsKey)
            return undefined;

        return content[propertyNameAsKey];
    }
}

export { ContentFieldDefinition, ErrorCode, ContentFieldType, ContentFieldTypes };
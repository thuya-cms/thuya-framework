import moment from "moment";
import Entity from "../../../common/entity";
import IdentifiableError from "../../../identifiable-error";
import logger from "../../../util/logger";
import expressHelper from "../../../common/utility/express-helper";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidType = "invalid-type",
    InvalidDisplayOption = "invalid-display-option",
    InvalidNumber = "invalid-number",
    InvalidDate = "invalid-date",
    InvalidArray = "invalid-array",
    ValueRequired = "value-required"
}

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date"
}

type ContentFieldValue = string | Date | number | string[] | Date[] | number[]; 
type ContentFieldValidator = (contentFieldData: ContentFieldValue) => void;
type ContentFieldDetermination = (contentFieldData: ContentFieldValue) => ContentFieldValue;

class ContentFieldDefinition extends Entity {
    private displayOptions: { key: string, value: any }[] = [];
    private isArrayOf: ContentFieldDefinition | undefined;
    private validators: ContentFieldValidator[] = [];
    private determinations: ContentFieldDetermination[] = [];

    
    
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

    addValidator(validator: ContentFieldValidator) {
        this.validators.push(validator);
    }

    getValidators(): ContentFieldValidator[] {
        return this.validators;
    }
    
    addDetermination(determination: ContentFieldDetermination) {
        this.determinations.push(determination);
    }

    getDeterminations(): ContentFieldDetermination[] {
        return this.determinations;
    }

    setIsArrayOf(contentFieldDefinition: ContentFieldDefinition) {
        this.isArrayOf = contentFieldDefinition;
    }

    getIsArrayOf(): ContentFieldDefinition | undefined {
        return this.isArrayOf;
    }

    validateValue(fieldValue: ContentFieldValue) {
        this.validateType(fieldValue);
        this.executeValidators(fieldValue);
        
    }

    executeDeterminations(fieldValue: ContentFieldValue): ContentFieldValue {
        let updatedValue = fieldValue;

        this.getDeterminations().forEach(determination => {
            updatedValue = determination(updatedValue);
        });

        return updatedValue;
    }


    private executeValidators(fieldValue: any) {
        this.getValidators().forEach(validator => {
            validator(fieldValue);
        });
    }

    private validateType(fieldValue: any) {
        let isArrayOf = this.isArrayOf;
        
        if (!fieldValue) return;

        if (isArrayOf) {
            if (!Array.isArray(fieldValue)) {
                logger.error(`Invalid array: ${fieldValue}.`);
                throw new IdentifiableError(ErrorCode.InvalidArray, "Provided value is not an array.");
            }

            let array: any[] = fieldValue;

            array.forEach(arrayElementValue => {
                isArrayOf!.validateValue(arrayElementValue);
            });
        } else {
            this.validateSingleField(fieldValue);
        }
    }

    private validateSingleField(fieldValue: any) {
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
}

export { ContentFieldDefinition, ErrorCode, ContentFieldType, ContentFieldValue as ContentFieldTypes };
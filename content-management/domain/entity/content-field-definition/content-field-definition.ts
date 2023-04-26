import Entity from "../../../../common/entity";
import IdentifiableError from "../../../../common/identifiable-error";

enum ErrorCode {
    InvalidName = "invalid-name",
    InvalidType = "invalid-type"
}

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array"
}

type ContentFieldValue = string | Date | number | string[] | Date[] | number[]; 
type ContentFieldValidator = (contentFieldData: ContentFieldValue) => void;
type ContentFieldDetermination = (contentFieldData: ContentFieldValue) => ContentFieldValue;

abstract class ContentFieldDefinition extends Entity {
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

    validateValue(fieldValue: ContentFieldValue) {
        this.getValidators().forEach(validator => {
            validator(fieldValue);
        });
    }

    executeDeterminations(fieldValue: ContentFieldValue): ContentFieldValue {
        let updatedValue = fieldValue;

        this.getDeterminations().forEach(determination => {
            updatedValue = determination(updatedValue);
        });

        return updatedValue;
    }
}

export { ContentFieldDefinition, ErrorCode, ContentFieldType, ContentFieldValue };
import { logger } from "../../../../common";
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
        
        if (!name) {
            logger.error(`Content field definition name is required.`);
            throw new IdentifiableError(ErrorCode.InvalidName, "Content field definition name is required.");
        }

        if (!Object.values(ContentFieldType).includes(type)) {
            logger.error(`Content field definition type is invalid.`);
            throw new IdentifiableError(ErrorCode.InvalidType, "Content field definition type is invalid.");
        }
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

        logger.debug(`Content for "%s" field is valid.`, this.getName());
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
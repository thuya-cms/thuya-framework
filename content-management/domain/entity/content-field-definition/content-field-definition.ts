import { Result, logger } from "../../../../common";
import Entity from "../../../../common/entity";
import IContentFieldHandlerProvider, { ContentFieldDetermination, ContentFieldValidator, ContentFieldValue } from "./content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array",
    Group = "group"
}

abstract class ContentFieldDefinition extends Entity implements IContentFieldHandlerProvider {
    private validators: ContentFieldValidator[] = [];
    private determinations: ContentFieldDetermination[] = [];

    
    
    constructor(
            id: string, 
            private name: string, 
            private type: ContentFieldType,
            private filePath?: string) {
        super(id);
        
        if (!name) {
            logger.error(`Content field definition name is required.`);
            throw new Error("Content field definition name is required.");
        }

        if (!Object.values(ContentFieldType).includes(type)) {
            logger.error(`Content field definition type is invalid.`);
            throw new Error("Content field definition type is invalid.");
        }
    }



    getPath(): string {
        return this.filePath || "";
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

    validateValue(fieldValue: ContentFieldValue): Result {
        for (const validator of this.getValidators()) {
            const result = validator(fieldValue);

            if (result.getIsFailing()) 
                return result;
        }

        logger.debug(`Content for "%s" field is valid.`, this.getName());

        return Result.success();
    }

    executeDeterminations(fieldValue: ContentFieldValue): ContentFieldValue {
        let updatedValue = fieldValue;

        for (const determination of this.getDeterminations()) { 
            updatedValue = determination(updatedValue);
        }

        return updatedValue;
    }
}

export { ContentFieldDefinition, ContentFieldType };
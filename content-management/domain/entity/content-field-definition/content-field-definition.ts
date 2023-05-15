import { Result, logger } from "../../../../common";
import Entity from "../../../../common/entity";
import IContentFieldHandlerProvider, { ContentFieldDetermination, ContentFieldValidator } from "./content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array",
    Group = "group"
}

abstract class ContentFieldDefinition<T = any> extends Entity implements IContentFieldHandlerProvider<T> {
    private validators: ContentFieldValidator<T>[] = [];
    private determinations: ContentFieldDetermination<T>[] = [];

    
    
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

    addValidator(validator: ContentFieldValidator<T>) {
        this.validators.push(validator);
    }

    getValidators(): ContentFieldValidator<T>[] {
        return this.validators;
    }
    
    addDetermination(determination: ContentFieldDetermination<T>) {
        this.determinations.push(determination);
    }

    getDeterminations(): ContentFieldDetermination<T>[] {
        return this.determinations;
    }

    validateValue(fieldValue: T): Result {
        for (const validator of this.getValidators()) {
            const result = validator(fieldValue);

            if (result.getIsFailing()) 
                return result;
        }

        logger.debug(`Content for "%s" field is valid.`, this.getName());

        return Result.success();
    }

    executeDeterminations(fieldValue: T): T {
        let updatedValue = fieldValue;

        for (const determination of this.getDeterminations()) { 
            updatedValue = determination(updatedValue);
        }

        return updatedValue;
    }
}

export { ContentFieldDefinition, ContentFieldType };
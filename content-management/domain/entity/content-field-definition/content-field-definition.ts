import { Result, Logger } from "../../../../common";
import Entity from "../../../../common/entity";
import IContentFieldDefinitionHandlerProvider, { ContentFieldDetermination, ContentFieldValidator } from "./content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array",
    Group = "group"
}

/**
 * Represents a content field definition. Abstract, the type specific implementations should be used.
 */
abstract class ContentFieldDefinition<T = any> extends Entity implements IContentFieldDefinitionHandlerProvider<T> {
    protected logger: Logger;
    
    
    private validators: ContentFieldValidator<T>[] = [];
    private determinations: ContentFieldDetermination<T>[] = [];
    

    
    constructor(
            id: string, 
            private name: string, 
            private type: ContentFieldType,
            private filePath?: string) {
        super(id);
        
        this.logger = Logger.for(ContentFieldDefinition.name);

        if (!name) {
            this.logger.error(`Content field definition name is required.`);
            throw new Error("Content field definition name is required.");
        }

        if (!Object.values(ContentFieldType).includes(type)) {
            this.logger.error(`Content field definition type is invalid.`);
            throw new Error("Content field definition type is invalid.");
        }
    }



    /**
     * @returns the path of the content field definition implementation
     */
    getPath(): string {
        return this.filePath || "";
    }

    /**
     * @returns name of the content field definition
     */
    getName(): string {
        return this.name;
    }

    /**
     * @returns type of the content field definition
     */
    getType(): ContentFieldType {
        return this.type;
    }

    /**
     * Add a new validator to the content field definition.
     * If a validator returns a failing {@link Result}, the content will not be saved.  
     * 
     * @param validator validator for the content field definition
     */
    addValidator(validator: ContentFieldValidator<T>): void {
        this.validators.push(validator);
    }

    /**
     * @returns validators for the content field definition 
     */
    getValidators(): ContentFieldValidator<T>[] {
        return this.validators;
    }
    
    /**
     * Add a new determination to the content field definition.
     * A determination cannot indicate business errors, but can change the content of the field.
     * 
     * @param determination determination for the content field definition
     */
    addDetermination(determination: ContentFieldDetermination<T>): void {
        this.determinations.push(determination);
    }

    /**
     * @returns determinations of the content field definition 
     */
    getDeterminations(): ContentFieldDetermination<T>[] {
        return this.determinations;
    }

    /**
     * Validate the value using this content field definition.
     * 
     * @param fieldValue the field value to validate
     * @returns result
     */
    validateValue(fieldValue: T): Result {
        for (const validator of this.getValidators()) {
            const result = validator(fieldValue);
            if (result.getIsFailing()) 
                return result;
        }

        this.logger.debug(`Content for "%s" field is valid.`, this.getName());
        return Result.success();
    }

    /**
     * Execute the determinations on a value based on this content field definition.
     * 
     * @param fieldValue the field value to change
     * @returns the value updated by determinations
     */
    executeDeterminations(fieldValue: T): T {
        let updatedValue = fieldValue;

        for (const determination of this.getDeterminations()) { 
            updatedValue = determination(updatedValue);
        }

        return updatedValue;
    }
}

export { ContentFieldDefinition, ContentFieldType };
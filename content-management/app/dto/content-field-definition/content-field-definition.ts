import IContentFieldDefinitionHandlerProvider, { ContentFieldDetermination, ContentFieldValidator } from "../../../domain/entity/content-field-definition/content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "text",
    Date = "date",
    Array = "array",
    Group = "group"
}

/**
 * Represents a content field definition. Abstract, the type specific implementations should be used.
 */
abstract class ContentFieldDefinitionDTO<T = any> implements IContentFieldDefinitionHandlerProvider<T> {
    protected filePath = "";
    
    private validators: ContentFieldValidator<T>[] = [];
    private determinations: ContentFieldDetermination<T>[] = [];

    

    constructor(
            private id: string, 
            private name: string, 
            private type: ContentFieldType) {
    }



    /**
     * @returns the path of the content field definition implementation 
     */
    getPath(): string {
        return this.filePath;
    }

    /**
     * @returns the id of the content field definition 
     */
    getId(): string {
        return this.id;
    }

    /**
     * @returns the name of the content field definition
     */
    getName(): string {
        return this.name;
    }

    /**
     * @returns the type of the content field definition
     */
    getType(): ContentFieldType {
        return this.type;
    }

    /**
     * @inheritdoc
     */
    getValidators(): ContentFieldValidator<T>[] {
        return this.validators;
    }

    /**
     * @inheritdoc
     */
    getDeterminations(): ContentFieldDetermination<T>[] {
        return this.determinations;
    }


    /**
     * Add a new validator to the content field definition.
     * If a validator returns a failing {@link Result}, the content will not be saved.  
     * 
     * @param validator validator for the content field definition
     */
    protected addValidator(validator: ContentFieldValidator<T>): void {
        this.validators.push(validator);
    }
    
    /**
     * Add a new determination to the content field definition.
     * A determination cannot indicate business errors, but can change the content of the field.
     * 
     * @param determination determination for the content field definition
     */
    protected addDetermination(determination: ContentFieldDetermination<T>): void {
        this.determinations.push(determination);
    }
}

export { ContentFieldDefinitionDTO, ContentFieldType };
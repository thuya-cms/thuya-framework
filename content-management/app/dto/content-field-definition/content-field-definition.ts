import IContentFieldHandlerProvider, { ContentFieldDetermination, ContentFieldValidator, ContentFieldValue } from "../../../domain/entity/content-field-definition/content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array",
    Group = "group"
}

abstract class ContentFieldDefinitionDTO implements IContentFieldHandlerProvider {
    private validators: ContentFieldValidator[] = [];
    private determinations: ContentFieldDetermination[] = [];

    protected filePath = "";
    
    

    constructor(
            private id: string, 
            private name: string, 
            private type: ContentFieldType) {
    }



    getPath(): string {
        return this.filePath;
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

    getValidators(): ContentFieldValidator[] {
        return this.validators;
    }

    getDeterminations(): ContentFieldDetermination[] {
        return this.determinations;
    }


    protected addValidator(validator: ContentFieldValidator) {
        this.validators.push(validator);
    }
    
    protected addDetermination(determination: ContentFieldDetermination) {
        this.determinations.push(determination);
    }
}

export { ContentFieldDefinitionDTO, ContentFieldType };
enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array"
}

type ContentFieldValue = string | Date | number | string[] | Date[] | number[]; 
type ContentFieldValidator = (contentFieldData: ContentFieldValue) => void;
type ContentFieldDetermination = (contentFieldData: ContentFieldValue) => ContentFieldValue;

abstract class ContentFieldDefinitionDTO {
    private validators: ContentFieldValidator[] = [];
    private determinations: ContentFieldDetermination[] = [];

    
    
    constructor(
            private id: string, 
            private name: string, 
            private type: ContentFieldType) {
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
}

export { ContentFieldDefinitionDTO, ContentFieldType, ContentFieldValue };
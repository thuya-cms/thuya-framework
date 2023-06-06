import IContentFieldHandlerProvider, { ContentFieldDetermination, ContentFieldValidator } from "../../../domain/entity/content-field-definition/content-field-handler-provider.interface";

enum ContentFieldType {
    Numeric = "numeric",
    Text = "string",
    Date = "date",
    Array = "array",
    Group = "group"
}

abstract class ContentFieldDefinitionDTO<T = any> implements IContentFieldHandlerProvider<T> {
    private validators: ContentFieldValidator<T>[] = [];
    private determinations: ContentFieldDetermination<T>[] = [];

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

    getValidators(): ContentFieldValidator<T>[] {
        return this.validators;
    }

    getDeterminations(): ContentFieldDetermination<T>[] {
        return this.determinations;
    }


    protected addValidator(validator: ContentFieldValidator<T>) {
        this.validators.push(validator);
    }
    
    protected addDetermination(determination: ContentFieldDetermination<T>) {
        this.determinations.push(determination);
    }
}

export { ContentFieldDefinitionDTO, ContentFieldType };
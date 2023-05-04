import { ContentFieldDetermination, ContentFieldValidator } from "../domain/entity/content-field-definition/content-field-definition";

interface IHandlerAccessor {
    addValidatorsForContentFieldDefinition(id: string, contentFieldValidators: ContentFieldValidator[]): void;
    addDeterminationsForContentFieldDefinition(id: string, contentFieldDeterminations: ContentFieldDetermination[]): void;
    getValidatorsForContentFieldDefinition(is: string): ContentFieldValidator[];
    getDeterminationsForContentFieldDefinition(id: string): ContentFieldDetermination[];
}

class InMemoryHandlerAccessor implements IHandlerAccessor {
    private contentFieldHandlers: {
        id: string,
        validators: ContentFieldValidator[],
        determinations: ContentFieldDetermination[]
    }[]



    constructor() {
        this.contentFieldHandlers = [];
    }



    addValidatorsForContentFieldDefinition(id: string, contentFieldValidators: ContentFieldValidator[]): void {
        let contentFieldDefinitionData = this.contentFieldHandlers.find(existingContentFieldDefinitionData => existingContentFieldDefinitionData.id === id);

        if (!contentFieldDefinitionData) {
            contentFieldDefinitionData = {
                id: id,
                validators: [],
                determinations: []
            };

            this.contentFieldHandlers.push(contentFieldDefinitionData);
        }

        for (const validator of contentFieldValidators)
            contentFieldDefinitionData.validators.push(validator);
    }

    addDeterminationsForContentFieldDefinition(id: string, contentFieldDeterminations: ContentFieldDetermination[]): void {
        let contentFieldDefinitionData = this.contentFieldHandlers.find(existingContentFieldDefinitionData => existingContentFieldDefinitionData.id === id);

        if (!contentFieldDefinitionData) {
            contentFieldDefinitionData = {
                id: id,
                validators: [],
                determinations: []
            };

            this.contentFieldHandlers.push(contentFieldDefinitionData);
        }

        for (const determination of contentFieldDeterminations)
            contentFieldDefinitionData.determinations.push(determination);
    }
    
    getValidatorsForContentFieldDefinition(id: string): ContentFieldValidator[] {
        const contentFieldDefinitionData = this.contentFieldHandlers.find(existingContentFieldDefinitionData => existingContentFieldDefinitionData.id === id);
        if (!contentFieldDefinitionData) return [];

        return contentFieldDefinitionData.validators;
    }

    getDeterminationsForContentFieldDefinition(id: string): ContentFieldDetermination[] {
        const contentFieldDefinitionData = this.contentFieldHandlers.find(existingContentFieldDefinitionData => existingContentFieldDefinitionData.id === id);
        if (!contentFieldDefinitionData) return [];

        return contentFieldDefinitionData.determinations;
    }

    clear() {
        this.contentFieldHandlers = [];
    }
}

export { IHandlerAccessor };
export default new InMemoryHandlerAccessor();
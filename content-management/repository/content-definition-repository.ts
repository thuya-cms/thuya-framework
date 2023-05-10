import { logger } from "../../common";
import { ContentDefinition } from "../domain/entity/content-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import { ContentFieldDefinition, ContentFieldType } from "../domain/entity/content-field-definition/content-field-definition";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";
import factory from "../domain/factory";
import IContentDefinitionRepository from "../domain/usecase/content-definition-repository.interface";
import { ContentDefinitionData, ContentFieldDefinitionData } from "../persistency/content-definition-persistency.interface";
import handlerAccessor from "../persistency/handler-accessor";

class ContentDefinitionRepository implements IContentDefinitionRepository {
    readContentDefinition(contentName: string): ContentDefinition<any> | undefined {
        try {
            const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
            const contentDefinitionData = contentDefinitionPersistency.readContentDefinition(contentName);
            const contentDefinitionResult = ContentDefinition.create(contentDefinitionData.id, contentDefinitionData.name);

            if (contentDefinitionResult.getIsFailing()) {
                logger.error("Failed to create content definition instance.");
                logger.error(contentDefinitionResult.getMessage());

                throw new Error("Failed to create content definition instance.")
            }

            const contentDefinition = contentDefinitionResult.getResult()!;

            for (const contentFieldDefinitionAssignment of contentDefinitionData.fields) {
                const contentFieldDefinitionData = contentDefinitionPersistency.readContentFieldDefinitionById(contentFieldDefinitionAssignment.id);
                const contentFieldDefinition = this.convertFieldDataToEntity(contentFieldDefinitionData);

                for (const validator of handlerAccessor.getValidatorsForContentFieldDefinition(contentFieldDefinitionData.id)) 
                    contentFieldDefinition.addValidator(validator);
                
                for (const determination of handlerAccessor.getDeterminationsForContentFieldDefinition(contentFieldDefinitionData.id)) 
                    contentFieldDefinition.addDetermination(determination);

                contentDefinition.addContentField(contentFieldDefinitionAssignment.name, contentFieldDefinition, contentFieldDefinitionAssignment.options);
            }

            return contentDefinition;
        }

        catch {
            return undefined;
        }
    }

    createContentDefinition(contentDefinition: ContentDefinition<any>): string {
        const contentDefinitionData: ContentDefinitionData = {
            id: "",
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const field = factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(contentField.contentFieldDefinition.getName());

            if (!field)
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);

            const fieldData = {
                id: field.id,
                name: contentField.name,
                options: {
                    isRequired: false,
                    isUnique: false
                }
            };

            if (contentField.options) {
                fieldData.options.isRequired = contentField.options.isRequired || false;
                fieldData.options.isUnique = contentField.options.isUnique || false;
            }

            contentDefinitionData.fields.push(fieldData);
        }

        return factory.getContentDefinitionPersistency().createContentDefinition(contentDefinitionData);
    }

    createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): string {
        const contentFieldDefinitionData: ContentFieldDefinitionData = {
            id: "",
            name: contentFieldDefinition.getName(),
            type: contentFieldDefinition.getType()
        };

        if (contentFieldDefinition.getType() === ContentFieldType.Array) {
            const arrayFieldDefinition = contentFieldDefinition as ArrayContentFieldDefinition;

            const arrayElementDefinitionData = factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(
                arrayFieldDefinition.getArrayElementType().getName());

            if (!arrayElementDefinitionData)
                throw new Error("Array element type not found.")

            contentFieldDefinitionData.arrayElementDefinitionId = arrayElementDefinitionData.id;
        }

        if (contentFieldDefinition.getType() === ContentFieldType.Group) {
            contentFieldDefinitionData.groupElements = [];

            const groupFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
            for (const groupElement of groupFieldDefinition.getContentFields()) {
                const groupElementDefinitionData = factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(
                    groupElement.contentFieldDefinition.getName());

                if (!groupElementDefinitionData)
                    throw new Error("Group element not found.");

                const groupElementData = {
                    id: groupElementDefinitionData.id,
                    name: groupElement.name,
                    options: {
                        isRequired: false
                    }
                };

                if (groupElement.options.isRequired)
                    groupElementData.options.isRequired = true;

                contentFieldDefinitionData.groupElements.push(groupElementData);
            }
        }

        const contentFieldDefinitionId = factory.getContentDefinitionPersistency().createContentFieldDefinition(contentFieldDefinitionData);
        
        handlerAccessor.addValidatorsForContentFieldDefinition(contentFieldDefinitionData.id, contentFieldDefinition.getValidators());
        handlerAccessor.addDeterminationsForContentFieldDefinition(contentFieldDefinitionData.id, contentFieldDefinition.getDeterminations());

        return contentFieldDefinitionId;
    }


    private convertFieldDataToEntity(contentFieldDefinitionData: ContentFieldDefinitionData) {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionData.type) {
            case ContentFieldType.Array: {
                const arrayElementDefinitionData = factory.getContentDefinitionPersistency().readContentFieldDefinitionById(
                    contentFieldDefinitionData.arrayElementDefinitionId!);

                if (!arrayElementDefinitionData) 
                    throw new Error("Array field element type is not defined.");

                const arrayElementDefinition = this.convertFieldDataToEntity(arrayElementDefinitionData);
                const createArrayFieldDefinitionResult = ArrayContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name, arrayElementDefinition);
                contentFieldDefinition = createArrayFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Date: {
                const createDateFieldDefinitionResult = DateContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createDateFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Group: {
                const createGroupFieldDefinitionResult = GroupContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                const groupContentField = createGroupFieldDefinitionResult.getResult()!;
                
                if (contentFieldDefinitionData.groupElements) {
                    for (const groupElement of contentFieldDefinitionData.groupElements) {
                        const groupElementDefinitionData = factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
    
                        if (!groupElementDefinitionData) 
                            throw new Error("Unknown group element type.");
    
                        groupContentField.addContentField(groupElement.name, this.convertFieldDataToEntity(groupElementDefinitionData), groupElement.options);
                    }
                }

                contentFieldDefinition = groupContentField;

                break;
            }

            case ContentFieldType.Numeric: {
                const createNumericFieldDefinitionResult = NumericContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createNumericFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Text: {
                const createTextFieldDefinitionResult = TextContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                contentFieldDefinition = createTextFieldDefinitionResult.getResult()!;

                break;
            }

            default: 
                throw new Error("Invalid field type.");
        }

        return contentFieldDefinition!;
    }
}

export default new ContentDefinitionRepository();
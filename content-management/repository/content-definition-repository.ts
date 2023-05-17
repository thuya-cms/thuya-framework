import { logger } from "../../common";
import { ContentDefinition } from "../domain/entity/content-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import { ContentFieldDefinition, ContentFieldType } from "../domain/entity/content-field-definition/content-field-definition";
import IContentFieldHandlerProvider from "../domain/entity/content-field-definition/content-field-handler-provider.interface";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";
import factory from "../domain/factory";
import IContentDefinitionRepository from "../domain/usecase/content-definition-repository.interface";
import { ContentDefinitionData, ContentFieldDefinitionData } from "../persistency/content-definition-persistency.interface";

class ContentDefinitionRepository implements IContentDefinitionRepository {
    async readContentDefinition(contentName: string): Promise<ContentDefinition | void> {
        try {
            const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
            const contentDefinitionData = await contentDefinitionPersistency.readContentDefinitionExpandingFields(contentName);
            const contentDefinitionResult = ContentDefinition.create(contentDefinitionData.id, contentDefinitionData.name);

            if (contentDefinitionResult.getIsFailing()) {
                logger.error("Failed to create content definition instance.");
                logger.error(contentDefinitionResult.getMessage());

                throw new Error("Failed to create content definition instance.")
            }

            const contentDefinition = contentDefinitionResult.getResult()!;

            for (const contentFieldDefinitionAssignment of contentDefinitionData.fields) {
                const contentFieldDefinition = await this.convertFieldDataToEntity(contentFieldDefinitionAssignment.field);
                const handlerProvider = this.getHandlerProvider(contentFieldDefinitionAssignment.field.path);

                if (handlerProvider) {
                    for (const validator of handlerProvider.getValidators()) 
                        contentFieldDefinition.addValidator(validator);
                    
                    for (const determination of handlerProvider.getDeterminations()) 
                        contentFieldDefinition.addDetermination(determination);
                }

                contentDefinition.addContentField(contentFieldDefinitionAssignment.name, contentFieldDefinition, contentFieldDefinitionAssignment.options);
            }

            return contentDefinition;
        }

        catch {
            return Promise.resolve();
        }
    }

    async createContentDefinition(contentDefinition: ContentDefinition<any>): Promise<string> {
        const contentDefinitionData: ContentDefinitionData = {
            id: "",
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const field = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(contentField.contentFieldDefinition.getName());

            if (!field)
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);

            const fieldData = {
                id: field.id,
                name: contentField.name,
                options: {
                    isRequired: false,
                    isUnique: false,
                    isIndexed: false
                }
            };

            if (contentField.options) {
                fieldData.options.isRequired = contentField.options.isRequired || false;
                fieldData.options.isUnique = contentField.options.isUnique || false;
                fieldData.options.isIndexed = contentField.options.isIndexed || false;
            }

            contentDefinitionData.fields.push(fieldData);
        }

        return await factory.getContentDefinitionPersistency().createContentDefinition(contentDefinitionData);
    }

    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<string> {
        const contentFieldDefinitionData: ContentFieldDefinitionData = {
            id: "",
            path: contentFieldDefinition.getPath(),
            name: contentFieldDefinition.getName(),
            type: contentFieldDefinition.getType()
        };

        if (contentFieldDefinition.getType() === ContentFieldType.Array) {
            const arrayFieldDefinition = contentFieldDefinition as ArrayContentFieldDefinition;

            const arrayElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(
                arrayFieldDefinition.getArrayElementType().getName());

            if (!arrayElementDefinitionData)
                throw new Error("Array element type not found.")

            contentFieldDefinitionData.arrayElementDefinitionId = arrayElementDefinitionData.id;
        }

        if (contentFieldDefinition.getType() === ContentFieldType.Group) {
            contentFieldDefinitionData.groupElements = [];

            const groupFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
            for (const groupElement of groupFieldDefinition.getContentFields()) {
                const groupElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(
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

        const contentFieldDefinitionId = await factory.getContentDefinitionPersistency().createContentFieldDefinition(contentFieldDefinitionData);

        return contentFieldDefinitionId;
    }


    private getHandlerProvider(path: string): IContentFieldHandlerProvider | undefined {
        if (!path || path.trim() === "")
            return undefined;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(path).default as IContentFieldHandlerProvider;
    }

    private async convertFieldDataToEntity(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<ContentFieldDefinition> {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionData.type) {
            case ContentFieldType.Array: {
                const arrayElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(
                    contentFieldDefinitionData.arrayElementDefinitionId!);

                if (!arrayElementDefinitionData) 
                    throw new Error("Array field element type is not defined.");

                const arrayElementDefinition = await this.convertFieldDataToEntity(arrayElementDefinitionData);
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
                        const groupElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
    
                        if (!groupElementDefinitionData) 
                            throw new Error("Unknown group element type.");
    
                        groupContentField.addContentField(groupElement.name, await this.convertFieldDataToEntity(groupElementDefinitionData), groupElement.options);
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
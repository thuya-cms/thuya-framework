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
import { ContentSchema, ContentSchemaElement } from "../persistency/content-persistency.interface";
import { ContentDefinitionData, ContentFieldDefinitionData } from "../persistency/content-definition-persistency.interface";
import Logger from "../../common/utility/logger";

class ContentDefinitionRepository implements IContentDefinitionRepository {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ContentDefinitionRepository.name);
    }



    async readContentDefinition(contentName: string): Promise<ContentDefinition | void> {
        const contentDefinitionPersistency = factory.getContentDefinitionPersistency();

        try {
            const expandedContentDefinitionData = await contentDefinitionPersistency.readContentDefinitionExpandingFields(contentName);
            
            const contentDefinitionResult = ContentDefinition.create(expandedContentDefinitionData.id, expandedContentDefinitionData.name);
            const contentDefinition = contentDefinitionResult.getResult()!;

            for (const contentFieldDefinitionAssignment of expandedContentDefinitionData.fields) {
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
            return;
        }
    }

    async createContentDefinition(contentDefinition: ContentDefinition<any>): Promise<string> {
        const contentDefinitionData: ContentDefinitionData = {
            id: "",
            name: contentDefinition.getName(),
            fields: []
        };
        const contentSchema: ContentSchema = []; 

        for (const contentField of contentDefinition.getContentFields()) {
            const field = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(contentField.contentFieldDefinition.getName());

            if (!field) {
                this.logger.error(`Not existing field "%s".`, contentField.contentFieldDefinition.getName());
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);
            }

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

            const contentSchemaElement = await this.getContentSchemaElement(field, fieldData);
            contentSchema.push(contentSchemaElement);
        }

        await factory.getContentPersistency().createContentSchema(contentDefinition.getName(), contentSchema);

        return await factory.getContentDefinitionPersistency().createContentDefinition(contentDefinitionData);
    }

    async deleteContentDefinitionByName(contentName: string): Promise<void> {
        return await factory.getContentDefinitionPersistency().deleteContentDefinitionByName(contentName);
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

            if (!arrayElementDefinitionData) {
                this.logger.error("Array element type not found.");
                throw new Error("Array element type not found.")
            }

            contentFieldDefinitionData.arrayElementDefinitionId = arrayElementDefinitionData.id;
        }

        if (contentFieldDefinition.getType() === ContentFieldType.Group) {
            contentFieldDefinitionData.groupElements = [];

            const groupFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
            for (const groupElement of groupFieldDefinition.getContentFields()) {
                const groupElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(
                    groupElement.contentFieldDefinition.getName());

                if (!groupElementDefinitionData) {
                    this.logger.error("Group element not found.");
                    throw new Error("Group element not found.");
                }

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


    private async getContentSchemaElement(field: ContentFieldDefinitionData, fieldAssignment: any): Promise<ContentSchemaElement> {
        const contentSchemaElement: ContentSchemaElement = {
            name: fieldAssignment.name,
            type: field.type,
            options: {
                isIndexed: fieldAssignment.options?.isIndexed || false,
                isRequired: fieldAssignment.options?.isRequired || false,
                isUnique: fieldAssignment.options?.isUnique || false
            }
        };

        if (field.type === ContentFieldType.Array) {
            const arrayFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(field.arrayElementDefinitionId!);
            contentSchemaElement.arrayElementType = {
                type: arrayFieldElement.type,
                groupElements: []
            };

            if (arrayFieldElement.type === ContentFieldType.Group) {
                for (const groupElement of arrayFieldElement.groupElements!) {
                    const groupFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
                    const groupElementSchema = await this.getContentSchemaElement(groupFieldElement, { name: groupElement.name, options: groupElement.options });
                    contentSchemaElement.arrayElementType.groupElements!.push(groupElementSchema);
                }
            }
        } else if (field.type === ContentFieldType.Group) {
            contentSchemaElement.groupElements = [];

            for (const groupElement of field.groupElements!) {
                const groupFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
                const groupElementSchema = await this.getContentSchemaElement(groupFieldElement, { name: groupElement.name, options: groupElement.options });
                contentSchemaElement.groupElements!.push(groupElementSchema);
            }
        }

        return contentSchemaElement;
    }

    private getHandlerProvider(path: string): IContentFieldHandlerProvider | undefined {
        if (!path || path.trim() === "")
            return undefined;

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(path).default as IContentFieldHandlerProvider;
        }

        catch (error) {
            this.logger.error(`Handler not found on path "%s".`, path);
            throw error;
        }
    }

    private async convertFieldDataToEntity(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<ContentFieldDefinition> {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionData.type) {
            case ContentFieldType.Array: {
                const arrayElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(
                    contentFieldDefinitionData.arrayElementDefinitionId!);

                if (!arrayElementDefinitionData) {
                    this.logger.error("Array field element type is not defined.");
                    throw new Error("Array field element type is not defined.");
                }

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
    
                        if (!groupElementDefinitionData) {
                            this.logger.error("Unknown group element type.");
                            throw new Error("Unknown group element type.");
                        }
    
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
                this.logger.error("Invalid field type.");
                throw new Error("Invalid field type.");
        }

        return contentFieldDefinition!;
    }
}

export default new ContentDefinitionRepository();
import { ContentDefinition } from "../domain/entity/content-definition/content-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import { ContentFieldDefinition, ContentFieldType } from "../domain/entity/content-field-definition/content-field-definition";
import IContentFieldDefinitionHandlerProvider from "../domain/entity/content-field-definition/content-field-handler-provider.interface";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";
import factory from "../domain/factory";
import IContentDefinitionRepository from "../domain/usecase/content-definition-repository.interface";
import { ContentSchema, ContentSchemaElement } from "../persistency/content-persistency.interface";
import { ContentDefinitionData, ContentFieldDefinitionData, ExpandedContentDefinitionData } from "../persistency/content-definition-persistency.interface";
import Logger from "../../common/utility/logger";

/**
 * Repository for content definitions and content field definitions.
 */
class ContentDefinitionRepository implements IContentDefinitionRepository {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ContentDefinitionRepository.name);
    }



    /**
     * @inheritdoc
     */
    async readContentDefinitionByName(contentDefinitionName: string): Promise<ContentDefinition | void> {
        const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
        const expandedContentDefinitionData = await contentDefinitionPersistency.readContentDefinitionExpandingFields(contentDefinitionName);
        
        if (!expandedContentDefinitionData) return;
        
        const contentDefinition = await this.convertDataToContentDefinition(expandedContentDefinitionData);

        return contentDefinition;
    }

    /**
     * @inheritdoc
     */
    async listContentDefinitions(): Promise<ContentDefinition[]> {
        const contentDefinitions: ContentDefinition[] = [];
        const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
        const contentDefinitionsData = await contentDefinitionPersistency.listContentDefinitions();

        for (const contentDefinitionData of contentDefinitionsData) {
            const contentDefinition = await this.convertDataToContentDefinition(contentDefinitionData);

            contentDefinitions.push(contentDefinition);
        }

        return contentDefinitions;
    }

    /**
     * @inheritdoc
     */
    async createContentDefinition(contentDefinition: ContentDefinition<any>): Promise<string> {
        const contentSchema: ContentSchema = []; 
        const contentDefinitionData: ContentDefinitionData = {
            id: "",
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const contentFieldDefinition = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(contentField.contentFieldDefinition.getName());
            if (!contentFieldDefinition) {
                this.logger.error(`Not existing field "%s".`, contentField.contentFieldDefinition.getName());
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);
            }

            const contentFieldData = {
                id: contentFieldDefinition.id,
                name: contentField.name,
                options: {
                    isRequired: false,
                    isUnique: false,
                    isIndexed: false,
                    isImmutable: false
                }
            };

            if (contentField.options) {
                contentFieldData.options.isRequired = contentField.options.isRequired || false;
                contentFieldData.options.isUnique = contentField.options.isUnique || false;
                contentFieldData.options.isIndexed = contentField.options.isIndexed || false;
                contentFieldData.options.isImmutable = contentField.options.isImmutable || false;
            }

            const contentSchemaElement = await this.getContentSchemaElement(contentFieldDefinition, contentFieldData);
            
            contentDefinitionData.fields.push(contentFieldData);
            contentSchema.push(contentSchemaElement);
        }

        await factory.getContentPersistency().createContentSchema(contentDefinition.getName(), contentSchema);
        return await factory.getContentDefinitionPersistency().createContentDefinition(contentDefinitionData);
    }

    /**
     * @inheritdoc
     */
    async updateContentDefinition(contentDefinition: ContentDefinition): Promise<void> {
        const contentDefinitionData: ContentDefinitionData = {
            id: contentDefinition.getId(),
            name: contentDefinition.getName(),
            fields: []
        };

        for (const contentField of contentDefinition.getContentFields()) {
            const contentFieldDefinition = await factory.getContentDefinitionPersistency().readContentFieldDefinitionByName(contentField.contentFieldDefinition.getName());
            if (!contentFieldDefinition) {
                this.logger.error(`Not existing field "%s".`, contentField.contentFieldDefinition.getName());
                throw new Error(`Not existing field "${ contentField.contentFieldDefinition.getName() }".`);
            }

            const contentFieldData = {
                id: contentFieldDefinition.id,
                name: contentField.name,
                options: {
                    isRequired: contentField.options.isRequired || false,
                    isUnique: contentField.options.isUnique || false,
                    isIndexed: contentField.options.isIndexed || false,
                    isImmutable: contentField.options.isImmutable || false
                }
            };

            contentDefinitionData.fields.push(contentFieldData);
        }

        await factory.getContentDefinitionPersistency().updateContentDefinition(contentDefinitionData);
    }

    /**
     * @inheritdoc
     */
    async deleteContentDefinitionByName(contentDefinitionName: string): Promise<void> {
        return await factory.getContentDefinitionPersistency().deleteContentDefinitionByName(contentDefinitionName);
    }

    /**
     * @inheritdoc
     */
    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<string> {
        const contentFieldDefinitionData = await this.convertFromContentFieldDefinitionToData(contentFieldDefinition);
        const contentFieldDefinitionId = await factory.getContentDefinitionPersistency().createContentFieldDefinition(contentFieldDefinitionData);
        
        return contentFieldDefinitionId;
    }

    /**
     * @inheritdoc
     */
    async updateContentFieldDefinition(contentFieldDefinition: ContentFieldDefinition): Promise<void> {
        const contentFieldDefinitionData = await this.convertFromContentFieldDefinitionToData(contentFieldDefinition);
        await factory.getContentDefinitionPersistency().updateContentFieldDefinition(contentFieldDefinitionData);
    }

    /**
     * @inheritdoc
     */
    async readContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<ContentFieldDefinition | void> {
        const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
        const contentFieldDefinitionData = await contentDefinitionPersistency.readContentFieldDefinitionByName(contentFieldDefinitionName);
        
        if (!contentFieldDefinitionData) return;
        
        const contentFieldDefinition = await this.convertDataToContentFieldDefinition(contentFieldDefinitionData);
        return contentFieldDefinition;
    }

    /**
     * @inheritdoc
     */
    async deleteContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<void> {
        return await factory.getContentDefinitionPersistency().deleteContentFieldDefinitionByName(contentFieldDefinitionName);
    }

    /**
     * @inheritdoc
     */
    async listContentFieldDefinitions(): Promise<ContentFieldDefinition[]> {
        const contentDefinitionPersistency = factory.getContentDefinitionPersistency();
        const contentFieldDefinitions: ContentFieldDefinition[] = [];
        const contentFieldDefinitionsData = await contentDefinitionPersistency.listContentFieldDefinitions();

        for (const contentFieldDefinitionData of contentFieldDefinitionsData) {
            const contentFieldDefinition = await this.convertDataToContentFieldDefinition(contentFieldDefinitionData);
            contentFieldDefinitions.push(contentFieldDefinition);
        }

        return contentFieldDefinitions;
    }


    private async convertFromContentFieldDefinitionToData(contentFieldDefinition: ContentFieldDefinition<any>): Promise<ContentFieldDefinitionData> {
        const contentFieldDefinitionData: ContentFieldDefinitionData = {
            id: contentFieldDefinition.getId(),
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
                throw new Error("Array element type not found.");
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
                        isRequired: groupElement.options.isRequired || false
                    }
                };

                contentFieldDefinitionData.groupElements.push(groupElementData);
            }
        }
        return contentFieldDefinitionData;
    }

    private async convertDataToContentDefinition(contentDefinitionData: ExpandedContentDefinitionData): Promise<ContentDefinition> {
        const instantiateContentDefinitionResult = ContentDefinition.create(contentDefinitionData.id, contentDefinitionData.name);
        if (instantiateContentDefinitionResult.getIsFailing()) {
            this.logger.error(instantiateContentDefinitionResult.getMessage());
            throw new Error(instantiateContentDefinitionResult.getMessage());
        }
 
        const contentDefinition = instantiateContentDefinitionResult.getResult()!;
        for (const contentFieldData of contentDefinitionData.fields) {
            const contentFieldDefinition = await this.convertDataToContentFieldDefinition(contentFieldData.field);
            const handlerProvider = this.getHandlerProvider(contentFieldData.field.path);

            if (handlerProvider) {
                for (const validator of handlerProvider.getValidators())
                    contentFieldDefinition.addValidator(validator);

                for (const determination of handlerProvider.getDeterminations())
                    contentFieldDefinition.addDetermination(determination);
            }

            contentDefinition.addContentField(contentFieldData.name, contentFieldDefinition, contentFieldData.options);
        }

        return contentDefinition;
    }

    private async getContentSchemaElement(contentFieldDefinitionData: ContentFieldDefinitionData, contentFieldData: any): Promise<ContentSchemaElement> {
        const contentSchemaElement: ContentSchemaElement = {
            name: contentFieldData.name,
            type: contentFieldDefinitionData.type,
            options: {
                isIndexed: contentFieldData.options?.isIndexed || false,
                isRequired: contentFieldData.options?.isRequired || false,
                isUnique: contentFieldData.options?.isUnique || false,
                isImmutable: contentFieldData.options?.isImmutable || false
            }
        };

        if (contentFieldDefinitionData.type === ContentFieldType.Array) {
            const arrayFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(contentFieldDefinitionData.arrayElementDefinitionId!);
            if (!arrayFieldElement) {
                throw new Error("Content field definition of array element does not exist.");
            }

            contentSchemaElement.arrayElementType = {
                type: arrayFieldElement.type,
                groupElements: []
            };

            if (arrayFieldElement.type === ContentFieldType.Group) {
                for (const groupElement of arrayFieldElement.groupElements!) {
                    const groupFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
                    if (!groupFieldElement) {
                        throw new Error("Content field definition of group field element does not exist.");
                    }
                    
                    const groupElementSchema = await this.getContentSchemaElement(groupFieldElement, { name: groupElement.name, options: groupElement.options });
                    contentSchemaElement.arrayElementType.groupElements!.push(groupElementSchema);
                }
            }
        } else if (contentFieldDefinitionData.type === ContentFieldType.Group) {
            contentSchemaElement.groupElements = [];

            for (const groupElement of contentFieldDefinitionData.groupElements!) {
                const groupFieldElement = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
                if (!groupFieldElement) {
                    throw new Error("Content field definition of group field element does not exist.");
                }
                
                const groupElementSchema = await this.getContentSchemaElement(groupFieldElement, { name: groupElement.name, options: groupElement.options });
                contentSchemaElement.groupElements!.push(groupElementSchema);
            }
        }

        return contentSchemaElement;
    }

    private getHandlerProvider(path: string): IContentFieldDefinitionHandlerProvider | undefined {
        if (!path || path.trim() === "")
            return undefined;

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(path).default as IContentFieldDefinitionHandlerProvider;
        }

        catch (error) {
            this.logger.error(`Handler not found on path "%s".`, path);
            throw error;
        }
    }

    private async convertDataToContentFieldDefinition(contentFieldDefinitionData: ContentFieldDefinitionData): Promise<ContentFieldDefinition> {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionData.type) {
            case ContentFieldType.Array: {
                const arrayElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(
                    contentFieldDefinitionData.arrayElementDefinitionId!);
                if (!arrayElementDefinitionData) {
                    this.logger.error("Array field element type is not defined.");
                    throw new Error("Array field element type is not defined.");
                }

                const arrayElementDefinition = await this.convertDataToContentFieldDefinition(arrayElementDefinitionData);
                const instantiateArrayFieldDefinitionResult = ArrayContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name, arrayElementDefinition);
                if (instantiateArrayFieldDefinitionResult.getIsFailing()) {
                    this.logger.error(instantiateArrayFieldDefinitionResult.getMessage());
                    throw new Error(instantiateArrayFieldDefinitionResult.getMessage());
                }
                
                contentFieldDefinition = instantiateArrayFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Date: {
                const instantiateDateFieldDefinitionResult = DateContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                if (instantiateDateFieldDefinitionResult.getIsFailing()) {
                    this.logger.error(instantiateDateFieldDefinitionResult.getMessage());
                    throw new Error(instantiateDateFieldDefinitionResult.getMessage());
                }

                contentFieldDefinition = instantiateDateFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Group: {
                const instantiateGroupFieldDefinitionResult = GroupContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                if (instantiateGroupFieldDefinitionResult.getIsFailing()) {
                    this.logger.error(instantiateGroupFieldDefinitionResult.getMessage());
                    throw new Error(instantiateGroupFieldDefinitionResult.getMessage());
                }

                const groupContentFieldDefinition = instantiateGroupFieldDefinitionResult.getResult()!;
                
                if (contentFieldDefinitionData.groupElements) {
                    for (const groupElement of contentFieldDefinitionData.groupElements) {
                        const groupElementDefinitionData = await factory.getContentDefinitionPersistency().readContentFieldDefinitionById(groupElement.id);
                        if (!groupElementDefinitionData) {
                            this.logger.error("Unknown group element type.");
                            throw new Error("Unknown group element type.");
                        }
    
                        groupContentFieldDefinition.addContentField(groupElement.name, await this.convertDataToContentFieldDefinition(groupElementDefinitionData), groupElement.options);
                    }
                }

                contentFieldDefinition = groupContentFieldDefinition;

                break;
            }

            case ContentFieldType.Numeric: {
                const instantiateNumericFieldDefinitionResult = NumericContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                if (instantiateNumericFieldDefinitionResult.getIsFailing()) {
                    this.logger.error(instantiateNumericFieldDefinitionResult.getMessage());
                    throw new Error(instantiateNumericFieldDefinitionResult.getMessage());
                }
                
                contentFieldDefinition = instantiateNumericFieldDefinitionResult.getResult()!;

                break;
            }

            case ContentFieldType.Text: {
                const instantiateTextFieldDefinitionResult = TextContentFieldDefinition.create(contentFieldDefinitionData.id, contentFieldDefinitionData.name);
                if (instantiateTextFieldDefinitionResult.getIsFailing()) {
                    this.logger.error(instantiateTextFieldDefinitionResult.getMessage());
                    throw new Error(instantiateTextFieldDefinitionResult.getMessage());
                }

                contentFieldDefinition = instantiateTextFieldDefinitionResult.getResult()!;

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
import { Result } from "../../common";
import { ContentDefinition } from "../domain/entity/content-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import { ContentFieldDefinition } from "../domain/entity/content-field-definition/content-field-definition";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";
import createContentFieldDefinition from "../domain/usecase/content-field-definition/create-content-field-definition";
import deleteContentDefinition from "../domain/usecase/content-definition/delete-content-definition";
import listContentDefinitions from "../domain/usecase/content-definition/list-content-definitions";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import updateContentDefinition from "../domain/usecase/content-definition/update-content-definition";
import ContentDefinitionDTO from "./dto/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
import DateContentFieldDefinitionDTO from "./dto/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinitionDTO from "./dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "./dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "./dto/content-field-definition/text-content-field-definition";
import deleteContentFieldDefinition from "../domain/usecase/content-field-definition/delete-content-field-definition";
import updateContentFieldDefinition from "../domain/usecase/content-field-definition/update-content-field-definition";
import readContentFieldDefinition from "../domain/usecase/content-field-definition/read-content-field-definition";
import listContentFieldDefinitions from "../domain/usecase/content-field-definition/list-content-field-definitions";

/**
 * Manager for content definition and content field definition.
 */
class ContentDefinitionManager {
    /**
     * Create a content definition.
     * 
     * @param contentDefinition the content definition
     * @returns result containing the id of the created content definition
     * @async
     */
    async createContentDefinition(contentDefinition: ContentDefinitionDTO): Promise<Result<string>> {
        const contentDefinitionEntityResult = this.convertDtoToEntity(contentDefinition);
        if (contentDefinitionEntityResult.getIsFailing())
            return Result.error(contentDefinitionEntityResult.getMessage());

        return await createContentDefinition.execute(contentDefinitionEntityResult.getResult()!);
    }
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinition the content definition
     * @returns result
     * @async
     */
    async updateContentDefinition(contentDefinition: ContentDefinitionDTO): Promise<Result> {
        const contentDefinitionEntityResult = this.convertDtoToEntity(contentDefinition);
        if (contentDefinitionEntityResult.getIsFailing())
            return Result.error(contentDefinitionEntityResult.getMessage());

        return await updateContentDefinition.execute(contentDefinitionEntityResult.getResult()!);
    }

    /**
     * Create a content field definition.
     * 
     * @param contentFieldDefinition the content field definition
     * @returns result containing the id of the created content field definition
     * @async
     */
    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinitionDTO): Promise<Result<string>> {
        const contentFieldDefinitionEntityResult = this.convertFieldDefinitionDtoToEntity(contentFieldDefinition);
        if (contentFieldDefinitionEntityResult.getIsFailing())
            return Result.error(contentFieldDefinitionEntityResult.getMessage());

        return await createContentFieldDefinition.execute(contentFieldDefinitionEntityResult.getResult()!);
    }

    /**
     * Read a content definition by name.
     * 
     * @param contentDefinitionName name of the content definition
     * @returns result containing the content definition
     * @async
     */
    async readContentDefinitionByName(contentDefinitionName: string): Promise<Result<ContentDefinitionDTO>> {
        const contentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (contentDefinitionResult.getIsFailing())
            return Result.error(contentDefinitionResult.getMessage());

        const contentDefinitionDTO = this.convertEntityToDto(contentDefinitionResult.getResult()!);

        return Result.success(contentDefinitionDTO);
    }

    /**
     * List content definitions.
     * 
     * @returns result containing the list of content definitions
     * @async
     */
    async listContentDefinitions(): Promise<Result<ContentDefinitionDTO[]>> {
        const contentDefinitionDTOs: ContentDefinitionDTO[] = [];

        const listContentDefinitionsResult = await listContentDefinitions.execute();
        if (listContentDefinitionsResult.getIsFailing()) 
            return Result.error(listContentDefinitionsResult.getMessage());

        for (const contentDefinition of listContentDefinitionsResult.getResult()!) {
            const contentDefinitionDTO = this.convertEntityToDto(contentDefinition);
            contentDefinitionDTOs.push(contentDefinitionDTO);
        }

        return Result.success(contentDefinitionDTOs);
    } 

    /**
     * Delete a content definition by name.
     * 
     * @param contentName content definition name
     * @returns result
     * @async
     */
    async deleteContentDefinitionByName(contentName: string): Promise<Result> {
        return await deleteContentDefinition.byName(contentName);
    }

    /**
     * Delete a content field definition by name.
     * 
     * @param contentFieldDefinitionName content field definition name
     * @returns result
     * @async
     */
    async deleteContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<Result> {
        return await deleteContentFieldDefinition.byName(contentFieldDefinitionName);
    }

    /**
     * read a content field definition by name.
     * 
     * @param contentFieldDefinitionName the content field definition name
     * @returns the content field definition or undefined
     * @async
     */
    async readContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<Result<ContentFieldDefinitionDTO | undefined>> {
        const readResult = await readContentFieldDefinition.byName(contentFieldDefinitionName);
        if (readResult.getIsFailing())
            return Result.error(readResult.getMessage());

        const contentFieldDefinitionDTO = this.convertFieldDefinitionEntityToDto(readResult.getResult()!);

        return Result.success(contentFieldDefinitionDTO);
    }

    async listContentFieldDefinitions(): Promise<Result<ContentFieldDefinitionDTO[]>> {
        const contentFieldDefinitionDTOs: ContentFieldDefinitionDTO[] = [];
        
        const listResult = await listContentFieldDefinitions.execute();
        if (listResult.getIsFailing())
            return Result.error(listResult.getMessage());

        for (const contentFieldDefinition of listResult.getResult()!) {
            const contentDefinitionDTO = this.convertFieldDefinitionEntityToDto(contentFieldDefinition);
            contentFieldDefinitionDTOs.push(contentDefinitionDTO);
        }

        return Result.success(contentFieldDefinitionDTOs);
    }


    private convertDtoToEntity(contentDefinition: ContentDefinitionDTO<any>): Result<ContentDefinition> {
        const contentDefinitionResult = ContentDefinition.create(contentDefinition.getId(), contentDefinition.getName());
        if (contentDefinitionResult.getIsFailing())
            return contentDefinitionResult;

        const contentDefinitionEntity = contentDefinitionResult.getResult();
        
        for (const contentField of contentDefinition.getContentFields()) {
            const fieldDefinitionEntityResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);

            if (fieldDefinitionEntityResult.getIsFailing())
                return Result.error(fieldDefinitionEntityResult.getMessage());

            const addFieldResult = contentDefinitionEntity!.addContentField(contentField.name, fieldDefinitionEntityResult.getResult()!, contentField.options);

            if (addFieldResult.getIsFailing())
                return Result.error(addFieldResult.getMessage());
        }

        return Result.success(contentDefinitionEntity);
    }

    private convertEntityToDto(contentDefinition: ContentDefinition): ContentDefinitionDTO {
        const contentDefinitionDTO = new ContentDefinitionDTO(contentDefinition.getId(), contentDefinition.getName());
        
        for (const contentField of contentDefinition.getContentFields()) {
            const fieldDefinitionDTO = this.convertFieldDefinitionEntityToDto(contentField.contentFieldDefinition);

            contentDefinitionDTO.addContentField(contentField.name, fieldDefinitionDTO, contentField.options);
        }

        return contentDefinitionDTO;
    }

    private convertFieldDefinitionDtoToEntity(contentFieldDefinitionDTO: ContentFieldDefinitionDTO): Result<ContentFieldDefinition> {
        let contentFieldEntity!: ContentFieldDefinition;

        switch (contentFieldDefinitionDTO.getType()) {
            case ContentFieldType.Array: {
                const arrayContentFieldDefinitionDTO: ArrayContentFieldDefinitionDTO = contentFieldDefinitionDTO as ArrayContentFieldDefinitionDTO;

                const arrayElementFieldResult = this.convertFieldDefinitionDtoToEntity(arrayContentFieldDefinitionDTO.getArrayElementType());
                
                if (arrayElementFieldResult.getIsFailing())
                    return arrayElementFieldResult;
                
                const arrayFieldResult = ArrayContentFieldDefinition.create(
                    arrayContentFieldDefinitionDTO.getId(),
                    arrayContentFieldDefinitionDTO.getName(),
                    arrayElementFieldResult.getResult()!,
                    arrayContentFieldDefinitionDTO.getPath());
                
                if (arrayFieldResult.getIsSuccessful()) 
                    contentFieldEntity = arrayFieldResult.getResult()!;
                else 
                    return arrayFieldResult;

                break;
            }

            case ContentFieldType.Date: {
                const dateFieldResult = DateContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());

                if (dateFieldResult.getIsSuccessful()) 
                    contentFieldEntity = dateFieldResult.getResult()!;
                else 
                    return dateFieldResult;

                break;
            }

            case ContentFieldType.Numeric: {
                const numericFieldResult = NumericContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());

                if (numericFieldResult.getIsSuccessful()) 
                    contentFieldEntity = numericFieldResult.getResult()!;
                else 
                    return numericFieldResult;

                break;
            }

            case ContentFieldType.Text: {
                const textFieldResult = TextContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());

                if (textFieldResult.getIsSuccessful()) 
                    contentFieldEntity = textFieldResult.getResult()!;
                else 
                    return textFieldResult;

                break;
            }

            case ContentFieldType.Group: {
                const groupContentFieldDefinitionDTO: GroupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;
                
                const groupFieldResult = GroupContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());
                
                if (groupFieldResult.getIsSuccessful()) 
                    contentFieldEntity = groupFieldResult.getResult()!;
                else 
                    return groupFieldResult;

                const groupContentFieldEntity: GroupContentFieldDefinition = contentFieldEntity as GroupContentFieldDefinition;
                
                for(const contentField of groupContentFieldDefinitionDTO.getContentFields()) {
                    const groupElementFieldResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);

                    if (groupElementFieldResult.getIsFailing())
                        return groupElementFieldResult;

                    const addFieldResult = groupContentFieldEntity.addContentField(
                        contentField.name, 
                        groupElementFieldResult.getResult()!,
                        contentField.options);

                    if (addFieldResult.getIsFailing())
                        return Result.error(addFieldResult.getMessage());
                }

                break;
            }

            default:
                throw new Error(`Field type "${contentFieldDefinitionDTO.getType()}" is not valid.`);
        }

        contentFieldDefinitionDTO.getValidators().forEach(validator => contentFieldEntity.addValidator(validator));
        contentFieldDefinitionDTO.getDeterminations().forEach(determination => contentFieldEntity.addDetermination(determination));

        return Result.success(contentFieldEntity);
    }
    
    private convertFieldDefinitionEntityToDto(contentFieldDefinition: ContentFieldDefinition): ContentFieldDefinitionDTO {
        let contentFieldDTO!: ContentFieldDefinitionDTO;

        if (contentFieldDefinition.getPath() && contentFieldDefinition.getPath().trim() !== "") {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(contentFieldDefinition.getPath()).default as ContentFieldDefinitionDTO;
        }

        switch (contentFieldDefinition.getType()) {
            case ContentFieldType.Array: {
                const arrayContentFieldDefinition: ArrayContentFieldDefinition = contentFieldDefinition as ArrayContentFieldDefinition;

                const arrayElementField = this.convertFieldDefinitionEntityToDto(arrayContentFieldDefinition.getArrayElementType());
                
                const arrayField = new ArrayContentFieldDefinitionDTO(
                    arrayContentFieldDefinition.getId(),
                    arrayContentFieldDefinition.getName(),
                    arrayElementField);
                
                contentFieldDTO = arrayField;

                break;
            }

            case ContentFieldType.Date: {
                const dateFieldDTO = new DateContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());

                contentFieldDTO = dateFieldDTO;

                break;
            }

            case ContentFieldType.Numeric: {
                const numericFieldDTO = new NumericContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());

                contentFieldDTO = numericFieldDTO;

                break;
            }

            case ContentFieldType.Text: {
                const textFieldDTO = new TextContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());

                contentFieldDTO = textFieldDTO;

                break;
            }

            case ContentFieldType.Group: {
                const groupContentFieldDefinition: GroupContentFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
                
                const groupFieldDTO = new GroupContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());
                
                contentFieldDTO = groupFieldDTO;
                const groupContentFieldDTO: GroupContentFieldDefinitionDTO = contentFieldDTO as GroupContentFieldDefinitionDTO;
                
                for(const contentField of groupContentFieldDefinition.getContentFields()) {
                    const groupElementField = this.convertFieldDefinitionEntityToDto(contentField.contentFieldDefinition);

                    groupContentFieldDTO.addContentField(
                        contentField.name, 
                        groupElementField,
                        contentField.options);
                }

                break;
            }

            default:
                throw new Error(`Field type "${contentFieldDefinition.getType()}" is not valid.`);
        }

        return contentFieldDTO;
    }
}

export default new ContentDefinitionManager();
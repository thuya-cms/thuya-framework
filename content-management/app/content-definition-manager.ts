import { Result } from "../../common";
import { ContentDefinition } from "../domain/entity/content-definition/content-definition";
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
import ContentDefinitionDTO from "./dto/content-definition/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
import DateContentFieldDefinitionDTO from "./dto/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinitionDTO from "./dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "./dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "./dto/content-field-definition/text-content-field-definition";
import deleteContentFieldDefinition from "../domain/usecase/content-field-definition/delete-content-field-definition";
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
        const convertContentDefinitionResult = this.convertDtoToEntity(contentDefinition);
        if (convertContentDefinitionResult.getIsFailing())
            return Result.error(convertContentDefinitionResult.getMessage());

        return await createContentDefinition.execute(convertContentDefinitionResult.getResult()!);
    }
    
    /**
     * Update a content definition.
     * 
     * @param contentDefinition the content definition
     * @returns result
     * @async
     */
    async updateContentDefinition(contentDefinition: ContentDefinitionDTO): Promise<Result> {
        const convertContentDefinitionResult = this.convertDtoToEntity(contentDefinition);
        if (convertContentDefinitionResult.getIsFailing())
            return Result.error(convertContentDefinitionResult.getMessage());

        return await updateContentDefinition.execute(convertContentDefinitionResult.getResult()!);
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
     * Read a content definition by name.
     * 
     * @param contentDefinitionName name of the content definition
     * @returns result containing the content definition
     * @async
     */
    async readContentDefinitionByName(contentDefinitionName: string): Promise<Result<ContentDefinitionDTO>> {
        const readContentDefinitionResult = await readContentDefinition.byName(contentDefinitionName);
        if (readContentDefinitionResult.getIsFailing())
            return Result.error(readContentDefinitionResult.getMessage());

        const contentDefinitionDTO = this.convertEntityToDto(readContentDefinitionResult.getResult()!);
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
     * Create a content field definition.
     * 
     * @param contentFieldDefinition the content field definition
     * @returns result containing the id of the created content field definition
     * @async
     */
    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinitionDTO): Promise<Result<string>> {
        const convertContentFieldDefinitionResult = this.convertFieldDefinitionDtoToEntity(contentFieldDefinition);
        if (convertContentFieldDefinitionResult.getIsFailing())
            return Result.error(convertContentFieldDefinitionResult.getMessage());

        return await createContentFieldDefinition.execute(convertContentFieldDefinitionResult.getResult()!);
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
     * Read a content field definition by name.
     * 
     * @param contentFieldDefinitionName the content field definition name
     * @returns result containing the content field definition or undefined
     * @async
     */
    async readContentFieldDefinitionByName(contentFieldDefinitionName: string): Promise<Result<ContentFieldDefinitionDTO | undefined>> {
        const readContentFieldDefinitionResult = await readContentFieldDefinition.byName(contentFieldDefinitionName);
        if (readContentFieldDefinitionResult.getIsFailing())
            return Result.error(readContentFieldDefinitionResult.getMessage());

        const contentFieldDefinitionDTO = this.convertFieldDefinitionEntityToDto(readContentFieldDefinitionResult.getResult()!);
        return Result.success(contentFieldDefinitionDTO);
    }

    /**
     * List content field definitions.
     * 
     * @returns result containing the list of content field definitions 
     * @async
     */
    async listContentFieldDefinitions(): Promise<Result<ContentFieldDefinitionDTO[]>> {
        const contentFieldDefinitionDTOs: ContentFieldDefinitionDTO[] = [];
        
        const listContentFieldDefinitionsResult = await listContentFieldDefinitions.execute();
        if (listContentFieldDefinitionsResult.getIsFailing())
            return Result.error(listContentFieldDefinitionsResult.getMessage());

        for (const contentFieldDefinition of listContentFieldDefinitionsResult.getResult()!) {
            const contentDefinitionDTO = this.convertFieldDefinitionEntityToDto(contentFieldDefinition);
            contentFieldDefinitionDTOs.push(contentDefinitionDTO);
        }

        return Result.success(contentFieldDefinitionDTOs);
    }


    private convertDtoToEntity(contentDefinitionDTO: ContentDefinitionDTO<any>): Result<ContentDefinition> {
        const instantiateContentDefinitionResult = ContentDefinition.create(contentDefinitionDTO.getId(), contentDefinitionDTO.getName());
        if (instantiateContentDefinitionResult.getIsFailing())
            return instantiateContentDefinitionResult;

        const contentDefinition = instantiateContentDefinitionResult.getResult()!;
        for (const contentField of contentDefinitionDTO.getContentFields()) {
            const convertFieldDefinitionResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);
            if (convertFieldDefinitionResult.getIsFailing())
                return Result.error(convertFieldDefinitionResult.getMessage());

            const addContentFieldFieldResult = contentDefinition.addContentField(contentField.name, convertFieldDefinitionResult.getResult()!, contentField.options);
            if (addContentFieldFieldResult.getIsFailing())
                return Result.error(addContentFieldFieldResult.getMessage());
        }

        return Result.success(contentDefinition);
    }

    private convertEntityToDto(contentDefinition: ContentDefinition): ContentDefinitionDTO {
        const contentDefinitionDTO = new ContentDefinitionDTO(contentDefinition.getId(), contentDefinition.getName());
        
        for (const contentField of contentDefinition.getContentFields()) {
            const contentFieldDefinitionDTO = this.convertFieldDefinitionEntityToDto(contentField.contentFieldDefinition);
            contentDefinitionDTO.addContentField(contentField.name, contentFieldDefinitionDTO, contentField.options);
        }

        return contentDefinitionDTO;
    }

    private convertFieldDefinitionDtoToEntity(contentFieldDefinitionDTO: ContentFieldDefinitionDTO): Result<ContentFieldDefinition> {
        let contentFieldDefinition: ContentFieldDefinition;

        switch (contentFieldDefinitionDTO.getType()) {
            case ContentFieldType.Array: {
                const arrayContentFieldDefinitionDTO: ArrayContentFieldDefinitionDTO = contentFieldDefinitionDTO as ArrayContentFieldDefinitionDTO;
                
                const convertArrayElementResult = this.convertFieldDefinitionDtoToEntity(arrayContentFieldDefinitionDTO.getArrayElementType());
                if (convertArrayElementResult.getIsFailing())
                    return convertArrayElementResult;
                
                const instantiateArrayContentFieldResult = ArrayContentFieldDefinition.create(
                    arrayContentFieldDefinitionDTO.getId(),
                    arrayContentFieldDefinitionDTO.getName(),
                    convertArrayElementResult.getResult()!,
                    arrayContentFieldDefinitionDTO.getPath());
                if (instantiateArrayContentFieldResult.getIsFailing())
                    return instantiateArrayContentFieldResult;

                contentFieldDefinition = instantiateArrayContentFieldResult.getResult()!;

                break;
            }

            case ContentFieldType.Date: {
                const instantiateDateContentFieldResult = DateContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());
                if (instantiateDateContentFieldResult.getIsFailing()) 
                    return instantiateDateContentFieldResult;
                
                contentFieldDefinition = instantiateDateContentFieldResult.getResult()!; 

                break;
            }

            case ContentFieldType.Numeric: {
                const instantiateNumericContentFieldResult = NumericContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());
                if (instantiateNumericContentFieldResult.getIsFailing()) 
                    return instantiateNumericContentFieldResult;
                
                contentFieldDefinition = instantiateNumericContentFieldResult.getResult()!;
                
                break;
            }

            case ContentFieldType.Text: {
                const instantiateTextContentFieldResult = TextContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());
                if (instantiateTextContentFieldResult.getIsFailing()) 
                    return instantiateTextContentFieldResult;
                    
                contentFieldDefinition = instantiateTextContentFieldResult.getResult()!;

                break;
            }

            case ContentFieldType.Group: {
                const groupContentFieldDefinitionDTO: GroupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;
                
                const instantiateGroupFieldResult = GroupContentFieldDefinition.create(
                    contentFieldDefinitionDTO.getId(), 
                    contentFieldDefinitionDTO.getName(), 
                    contentFieldDefinitionDTO.getPath());
                if (instantiateGroupFieldResult.getIsFailing()) 
                    return instantiateGroupFieldResult;
                
                contentFieldDefinition = instantiateGroupFieldResult.getResult()!; 
                const groupContentFieldDefinition: GroupContentFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
                
                for(const contentField of groupContentFieldDefinitionDTO.getContentFields()) {
                    const convertGroupElementResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);
                    if (convertGroupElementResult.getIsFailing())
                        return convertGroupElementResult;

                    const addFieldResult = groupContentFieldDefinition.addContentField(
                        contentField.name, 
                        convertGroupElementResult.getResult()!,
                        contentField.options);
                    if (addFieldResult.getIsFailing())
                        return Result.error(addFieldResult.getMessage());
                }

                break;
            }

            default:
                throw new Error(`Field type "${contentFieldDefinitionDTO.getType()}" is not valid.`);
        }

        contentFieldDefinitionDTO.getValidators().forEach(validator => contentFieldDefinition.addValidator(validator));
        contentFieldDefinitionDTO.getDeterminations().forEach(determination => contentFieldDefinition.addDetermination(determination));

        return Result.success(contentFieldDefinition);
    }
    
    private convertFieldDefinitionEntityToDto(contentFieldDefinition: ContentFieldDefinition): ContentFieldDefinitionDTO {
        let contentFieldDefinitionDTO: ContentFieldDefinitionDTO;

        if (contentFieldDefinition.getPath() && contentFieldDefinition.getPath().trim() !== "") 
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require(contentFieldDefinition.getPath()).default as ContentFieldDefinitionDTO;

        switch (contentFieldDefinition.getType()) {
            case ContentFieldType.Array: {
                const arrayContentFieldDefinition: ArrayContentFieldDefinition = contentFieldDefinition as ArrayContentFieldDefinition;
                const arrayElementDTO = this.convertFieldDefinitionEntityToDto(arrayContentFieldDefinition.getArrayElementType());
                const arrayContentFieldDefinitionDTO = new ArrayContentFieldDefinitionDTO(
                    arrayContentFieldDefinition.getId(),
                    arrayContentFieldDefinition.getName(),
                    arrayElementDTO);
                
                contentFieldDefinitionDTO = arrayContentFieldDefinitionDTO;

                break;
            }

            case ContentFieldType.Date: {
                const dateContentFieldDefinitionDTO = new DateContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());
                contentFieldDefinitionDTO = dateContentFieldDefinitionDTO;

                break;
            }

            case ContentFieldType.Numeric: {
                const numericContentFieldDefinitionDTO = new NumericContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());
                contentFieldDefinitionDTO = numericContentFieldDefinitionDTO;

                break;
            }

            case ContentFieldType.Text: {
                const textContentFieldDefinitionDTO = new TextContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());
                contentFieldDefinitionDTO = textContentFieldDefinitionDTO;

                break;
            }

            case ContentFieldType.Group: {
                const groupContentFieldDefinition: GroupContentFieldDefinition = contentFieldDefinition as GroupContentFieldDefinition;
                const groupContentFieldDefinitionDTO = new GroupContentFieldDefinitionDTO(contentFieldDefinition.getId(), contentFieldDefinition.getName());
                
                contentFieldDefinitionDTO = groupContentFieldDefinitionDTO;
                const groupContentFieldDTO: GroupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;
                
                for(const contentField of groupContentFieldDefinition.getContentFields()) {
                    const groupElement = this.convertFieldDefinitionEntityToDto(contentField.contentFieldDefinition);

                    groupContentFieldDTO.addContentField(
                        contentField.name, 
                        groupElement,
                        contentField.options);
                }

                break;
            }

            default:
                throw new Error(`Field type "${contentFieldDefinition.getType()}" is not valid.`);
        }

        return contentFieldDefinitionDTO;
    }
}

export default new ContentDefinitionManager();
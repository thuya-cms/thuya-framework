import { Result, logger } from "../../common";
import { ContentDefinition } from "../domain/entity/content-definition";
import ArrayContentFieldDefinition from "../domain/entity/content-field-definition/array-content-field-definition";
import { ContentFieldDefinition } from "../domain/entity/content-field-definition/content-field-definition";
import DateContentFieldDefinition from "../domain/entity/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinition from "../domain/entity/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinition from "../domain/entity/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinition from "../domain/entity/content-field-definition/text-content-field-definition";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";
import createContentFieldDefinition from "../domain/usecase/content-definition/create-content-field-definition";
import readContentDefinition from "../domain/usecase/content-definition/read-content-definition";
import ContentDefinitionDTO from "./dto/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
import DateContentFieldDefinitionDTO from "./dto/content-field-definition/date-content-field-definition";
import GroupContentFieldDefinitionDTO from "./dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "./dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "./dto/content-field-definition/text-content-field-definition";

class ContentDefinitionManager {
    async createContentDefinition(contentDefinition: ContentDefinitionDTO): Promise<Result> {
        const contentDefinitionEntityResult = this.convertDtoToEntity(contentDefinition);
        if (contentDefinitionEntityResult.getIsFailing())
            return Result.error(contentDefinitionEntityResult.getMessage());

        return await createContentDefinition.execute(contentDefinitionEntityResult.getResult()!);
    }

    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinitionDTO): Promise<Result> {
        const contentFieldDefinitionEntityResult = this.convertFieldDefinitionDtoToEntity(contentFieldDefinition);
        if (contentFieldDefinitionEntityResult.getIsFailing())
            return Result.error(contentFieldDefinitionEntityResult.getMessage());

        return await createContentFieldDefinition.execute(contentFieldDefinitionEntityResult.getResult()!);
    }

    async readContentDefinitionByName(contentDefinitionName: string): Promise<Result<ContentDefinitionDTO>> {
        const contentDefinitionResult = await readContentDefinition.execute(contentDefinitionName);
        if (contentDefinitionResult.getIsFailing())
            return Result.error(contentDefinitionResult.getMessage());

        const contentDefinitionDTO = this.convertEntityToDto(contentDefinitionResult.getResult()!);

        return Result.success(contentDefinitionDTO);
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
                    arrayElementFieldResult.getResult()!);
                
                if (arrayFieldResult.getIsSuccessful()) 
                    contentFieldEntity = arrayFieldResult.getResult()!;
                else 
                    return arrayFieldResult;

                break;
            }

            case ContentFieldType.Date: {
                const dateFieldResult = DateContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (dateFieldResult.getIsSuccessful()) 
                    contentFieldEntity = dateFieldResult.getResult()!;
                else 
                    return dateFieldResult;

                break;
            }

            case ContentFieldType.Numeric: {
                const numericFieldResult = NumericContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (numericFieldResult.getIsSuccessful()) 
                    contentFieldEntity = numericFieldResult.getResult()!;
                else 
                    return numericFieldResult;

                break;
            }

            case ContentFieldType.Text: {
                const textFieldResult = TextContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (textFieldResult.getIsSuccessful()) 
                    contentFieldEntity = textFieldResult.getResult()!;
                else 
                    return textFieldResult;

                break;
            }

            case ContentFieldType.Group: {
                const groupContentFieldDefinitionDTO: GroupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;
                
                const groupFieldResult = GroupContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());
                
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
                logger.error(`Field type "%s" is not valid.`, contentFieldDefinitionDTO.getType())
                throw new Error(`Field type "${contentFieldDefinitionDTO.getType()}" is not valid.`);
        }

        contentFieldDefinitionDTO.getValidators().forEach(validator => contentFieldEntity.addValidator(validator));
        contentFieldDefinitionDTO.getDeterminations().forEach(determination => contentFieldEntity.addDetermination(determination));

        return Result.success(contentFieldEntity);
    }
    
    private convertFieldDefinitionEntityToDto(contentFieldDefinition: ContentFieldDefinition): ContentFieldDefinitionDTO {
        let contentFieldDTO!: ContentFieldDefinitionDTO;

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
                logger.error(`Field type "%s" is not valid.`, contentFieldDefinition.getType())
                throw new Error(`Field type "${contentFieldDefinition.getType()}" is not valid.`);
        }

        contentFieldDefinition.getValidators().forEach(validator => contentFieldDTO.addValidator(validator));
        contentFieldDefinition.getDeterminations().forEach(determination => contentFieldDTO.addDetermination(determination));

        return contentFieldDTO;
    }
}

export default new ContentDefinitionManager();
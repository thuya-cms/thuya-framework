import { Result, logger } from "../../common";
import { GroupContentFieldDefinition, ArrayContentFieldDefinition, ContentDefinition, ContentFieldDefinition, DateContentFieldDefinition, NumericContentFieldDefinition, TextContentFieldDefinition } from "../domain";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";
import ContentDefinitionDTO from "./dto/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
import GroupContentFieldDefinitionDTO from "./dto/content-field-definition/group-content-field-definition";

class ContentDefinitionManager {
    createContentDefinition(contentDefinition: ContentDefinitionDTO): Result {
        const contentDefinitionEntityResult = this.convertDtoToEntity(contentDefinition);
        if (contentDefinitionEntityResult.getIsFailing())
            return Result.error(contentDefinitionEntityResult.getMessage());

        const createContentDefinitionResult = createContentDefinition.execute(contentDefinitionEntityResult.getResult()!);
        return createContentDefinitionResult;
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
}

export default new ContentDefinitionManager();
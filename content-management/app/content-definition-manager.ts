import { Result, logger } from "../../common";
import { GroupContentFieldDefinition, ArrayContentFieldDefinition, ContentDefinition, ContentFieldDefinition, DateContentFieldDefinition, NumericContentFieldDefinition, TextContentFieldDefinition } from "../domain";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";
import ContentDefinitionDTO from "./dto/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
import GroupContentFieldDefinitionDTO from "./dto/content-field-definition/group-content-field-definition";

class ContentDefinitionManager {
    createContentDefinition(contentDefinition: ContentDefinitionDTO): Result {
        let contentDefinitionEntityResult = this.convertDtoToEntity(contentDefinition);
        if (contentDefinitionEntityResult.getIsFailing())
            return Result.error(contentDefinitionEntityResult.getMessage());

        let createContentDefinitionResult = createContentDefinition.execute(contentDefinitionEntityResult.getResult()!);
        return createContentDefinitionResult;
    }


    private convertDtoToEntity(contentDefinition: ContentDefinitionDTO<any>): Result<ContentDefinition> {
        let contentDefinitionResult = ContentDefinition.create(contentDefinition.getId(), contentDefinition.getName());
        if (contentDefinitionResult.getIsFailing())
            return contentDefinitionResult;

        let contentDefinitionEntity = contentDefinitionResult.getResult();
        
        for (let contentField of contentDefinition.getContentFields()) {
            let fieldDefinitionEntityResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);

            if (fieldDefinitionEntityResult.getIsFailing())
                return Result.error(fieldDefinitionEntityResult.getMessage());

            let addFieldResult = contentDefinitionEntity!.addContentField(contentField.name, fieldDefinitionEntityResult.getResult()!, contentField.options);

            if (addFieldResult.getIsFailing())
                return Result.error(addFieldResult.getMessage());
        }

        return Result.success(contentDefinitionEntity);
    }

    private convertFieldDefinitionDtoToEntity(contentFieldDefinitionDTO: ContentFieldDefinitionDTO): Result<ContentFieldDefinition> {
        let contentFieldEntity!: ContentFieldDefinition;

        switch (contentFieldDefinitionDTO.getType()) {
            case ContentFieldType.Array:
                let arrayContentFieldDefinitionDTO: ArrayContentFieldDefinitionDTO = contentFieldDefinitionDTO as ArrayContentFieldDefinitionDTO;

                let arrayElementFieldResult = this.convertFieldDefinitionDtoToEntity(arrayContentFieldDefinitionDTO.getArrayElementType());
                
                if (arrayElementFieldResult.getIsFailing())
                    return arrayElementFieldResult;
                
                let arrayFieldResult = ArrayContentFieldDefinition.create(
                    arrayContentFieldDefinitionDTO.getId(),
                    arrayContentFieldDefinitionDTO.getName(),
                    arrayElementFieldResult.getResult()!);
                
                if (arrayFieldResult.getIsSuccessful()) 
                    contentFieldEntity = arrayFieldResult.getResult()!;
                else 
                    return arrayFieldResult;

                break;

            case ContentFieldType.Date:
                let dateFieldResult = DateContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (dateFieldResult.getIsSuccessful()) 
                    contentFieldEntity = dateFieldResult.getResult()!;
                else 
                    return dateFieldResult;

                break;

            case ContentFieldType.Numeric:
                let numericFieldResult = NumericContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (numericFieldResult.getIsSuccessful()) 
                    contentFieldEntity = numericFieldResult.getResult()!;
                else 
                    return numericFieldResult;

                break;

            case ContentFieldType.Text:
                let textFieldResult = TextContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());

                if (textFieldResult.getIsSuccessful()) 
                    contentFieldEntity = textFieldResult.getResult()!;
                else 
                    return textFieldResult;

                break;

            case ContentFieldType.Group:
                let groupContentFieldDefinitionDTO: GroupContentFieldDefinitionDTO = contentFieldDefinitionDTO as GroupContentFieldDefinitionDTO;
                
                let groupFieldResult = GroupContentFieldDefinition.create(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());
                
                if (groupFieldResult.getIsSuccessful()) 
                    contentFieldEntity = groupFieldResult.getResult()!;
                else 
                    return groupFieldResult;

                let groupContentFieldEntity: GroupContentFieldDefinition = contentFieldEntity as GroupContentFieldDefinition;
                
                for(let contentField of groupContentFieldDefinitionDTO.getContentFields()) {
                    let groupElementFieldResult = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);

                    if (groupElementFieldResult.getIsFailing())
                        return groupElementFieldResult;

                    let addFieldResult = groupContentFieldEntity.addContentField(
                        contentField.name, 
                        groupElementFieldResult.getResult()!,
                        contentField.options);

                    if (addFieldResult.getIsFailing())
                        return Result.error(addFieldResult.getMessage());
                }

                break;

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
import IdentifiableError from "../../common/identifiable-error";
import { ArrayContentFieldDefinition, ContentDefinition, ContentFieldDefinition, DateContentFieldDefinition, NumericContentFieldDefinition, TextContentFieldDefinition } from "../domain";
import createContentDefinition from "../domain/usecase/content-definition/create-content-definition";
import ContentDefinitionDTO from "./dto/content-definition";
import ArrayContentFieldDefinitionDTO from "./dto/content-field-definition/array-content-field-definition";
import { ContentFieldDefinitionDTO, ContentFieldType } from "./dto/content-field-definition/content-field-definition";
 
enum ErrorCode {
    InvalidFieldType = "invalid-field-type"
}

class ContentDefinitionManager {
    createContentDefinition(contentDefinition: ContentDefinitionDTO<any>) {
        let contentDefinitionEntity = this.convertDtoToEntity(contentDefinition);
        createContentDefinition.execute(contentDefinitionEntity);
    }


    private convertDtoToEntity(contentDefinition: ContentDefinitionDTO<any>): ContentDefinition<any> {
        let contentDefinitionEntity = new ContentDefinition(contentDefinition.getId(), contentDefinition.getName());
        
        contentDefinition.getContentFields().forEach(contentField => {
            let fieldDefinitionEntity = this.convertFieldDefinitionDtoToEntity(contentField.contentFieldDefinition);
            contentDefinitionEntity.addContentField(contentField.name, fieldDefinitionEntity, contentField.options);
        });

        return contentDefinitionEntity;
    }

    private convertFieldDefinitionDtoToEntity(contentFieldDefinitionDTO: ContentFieldDefinitionDTO): ContentFieldDefinition {
        let contentFieldEntity: ContentFieldDefinition;

        switch (contentFieldDefinitionDTO.getType()) {
            case ContentFieldType.Array:
                let arrayContentFieldDefinitionDTO: ArrayContentFieldDefinitionDTO = contentFieldDefinitionDTO as ArrayContentFieldDefinitionDTO;

                contentFieldEntity = new ArrayContentFieldDefinition(
                    arrayContentFieldDefinitionDTO.getId(),
                    arrayContentFieldDefinitionDTO.getName(),
                    this.convertFieldDefinitionDtoToEntity(arrayContentFieldDefinitionDTO.getArrayElementType()));
                break;

            case ContentFieldType.Date:
                contentFieldEntity = new DateContentFieldDefinition(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());
                break;

            case ContentFieldType.Numeric:
                contentFieldEntity = new NumericContentFieldDefinition(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());
                break;

            case ContentFieldType.Text:
                contentFieldEntity = new TextContentFieldDefinition(contentFieldDefinitionDTO.getId(), contentFieldDefinitionDTO.getName());
                break;

            default:
                throw new IdentifiableError(ErrorCode.InvalidFieldType, `Field type ${contentFieldDefinitionDTO.getType()} is not valid.`);
        }

        contentFieldDefinitionDTO.getValidators().forEach(validator => contentFieldEntity.addValidator(validator));
        contentFieldDefinitionDTO.getDeterminations().forEach(determination => contentFieldEntity.addDetermination(determination));

        return contentFieldEntity;
    }
}

export default new ContentDefinitionManager();
export { ErrorCode };
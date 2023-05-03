import { should } from "chai";
import contentDefinitionManager from "../../content-management/app/content-definition-manager";
import { ContentFieldDefinitionDTO } from "../../content-management/app/dto/content-field-definition/content-field-definition";
import ContentDefinitionDTO from "../../content-management/app/dto/content-definition";

class ContentDefinitionUtility {
    defineContentField(contentFieldDefinition: ContentFieldDefinitionDTO): ContentFieldDefinitionDTO {
        const createContentFieldDefinitionResult = contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
        should().equal(createContentFieldDefinitionResult.getIsSuccessful(), true, createContentFieldDefinitionResult.getMessage());

        return contentFieldDefinition;
    }

    defineContent(contentDefinition: ContentDefinitionDTO): ContentDefinitionDTO {
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        should().equal(createContentDefinitionResult.getIsSuccessful(), true, createContentDefinitionResult.getMessage());

        return contentDefinition;
    }
}

export default new ContentDefinitionUtility();
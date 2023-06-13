import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import { ContentFieldDefinitionDTO } from "../../../content-management/app/dto/content-field-definition/content-field-definition";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";

class ContentDefinitionUtility {
    async defineContentField(contentFieldDefinition: ContentFieldDefinitionDTO): Promise<ContentFieldDefinitionDTO> {
        const createContentFieldDefinitionResult = await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
        expect(createContentFieldDefinitionResult.getIsSuccessful(), createContentFieldDefinitionResult.getMessage()).to.be.true;

        return contentFieldDefinition;
    }

    async defineContent(contentDefinition: ContentDefinitionDTO): Promise<ContentDefinitionDTO> {
        const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinition);
        expect(createContentDefinitionResult.getIsSuccessful(), createContentDefinitionResult.getMessage()).to.be.true;

        return contentDefinition.clone(createContentDefinitionResult.getResult()!);
    }
}

export default new ContentDefinitionUtility();
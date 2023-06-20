import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import { ContentFieldDefinitionDTO } from "../../../content-management/app/dto/content-field-definition/content-field-definition";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";

/**
 * Content definition utility.
 */
class ContentDefinitionUtility {
    /**
     * Create a new content field definition.
     * 
     * @param contentFieldDefinition the content field definition
     * @returns the content field definition
     */
    async createContentFieldDefinition(contentFieldDefinition: ContentFieldDefinitionDTO): Promise<ContentFieldDefinitionDTO> {
        const createContentFieldDefinitionResult = await contentDefinitionManager.createContentFieldDefinition(contentFieldDefinition);
        expect(createContentFieldDefinitionResult.getIsSuccessful(), createContentFieldDefinitionResult.getMessage()).to.be.true;

        return contentFieldDefinition;
    }

    /**
     * Create a content definition.
     * 
     * @param contentDefinition the content definition
     * @returns the created content definition with the new id
     */
    async createContentDefinition(contentDefinition: ContentDefinitionDTO): Promise<ContentDefinitionDTO> {
        const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinition);
        expect(createContentDefinitionResult.getIsSuccessful(), createContentDefinitionResult.getMessage()).to.be.true;

        return contentDefinition.clone(createContentDefinitionResult.getResult()!);
    }
}

export default new ContentDefinitionUtility();
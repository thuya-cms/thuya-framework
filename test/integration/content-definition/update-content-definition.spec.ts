import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("update content definition", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be updated with a new field", async () => {
        const contentDefinitionDTO = await contentDefinitionUtil.createContentDefinition(new ContentDefinitionDTO("", "test-definition"));

        const contentFieldDefinitionDTO = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "new-field"));
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
         
        const updateResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
        expect(updateResult.getIsSuccessful(), updateResult.getMessage()).to.be.true;

        const readContentDefinitionResult = await contentDefinitionManager.readContentDefinitionByName("test-definition");
        expect(readContentDefinitionResult.getIsSuccessful(), readContentDefinitionResult.getMessage()).to.be.true;
        expect(readContentDefinitionResult.getResult()!.getContentFields().length).to.equal(2);
    });
    
    it("should fail with duplicate fields", async () => {
        const contentDefinitionDTO = await contentDefinitionUtil.createContentDefinition(new ContentDefinitionDTO("", "test-definition"));

        const contentFieldDefinitionDTO = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "new-field"));
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
         
        const updateResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
        expect(updateResult.getIsFailing()).to.be.true;
    });
    
    it("should fail for not existing content definition", async () => {
        const contentDefinitionDTO = new ContentDefinitionDTO("some-id", "dummy");
            
        const updateResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
        expect(updateResult.getIsFailing()).to.be.true;
        expect(updateResult.getMessage()).to.equal(`Content definition "dummy" does not exist.`)
    });
});
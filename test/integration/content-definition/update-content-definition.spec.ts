import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("update content definition", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be updated with a new field", async () => {
        const contentDefinitionDTO = await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));

        const contentFieldDefinitionDTO = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "new-field"));
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
         
        const updateResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
        expect(updateResult.getIsSuccessful(), updateResult.getMessage()).to.be.true;

        const readContentDefinitionResult = await contentDefinitionManager.readContentDefinitionByName("test-definition");
        expect(readContentDefinitionResult.getIsSuccessful(), readContentDefinitionResult.getMessage()).to.be.true;
        expect(readContentDefinitionResult.getResult()!.getContentFields().length).to.equal(2);
    });
    
    it("should fail with duplicate fields", async () => {
        const contentDefinitionDTO = await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));

        const contentFieldDefinitionDTO = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "new-field"));
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
        contentDefinitionDTO.addContentField("new-field", contentFieldDefinitionDTO);
         
        const updateResult = await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
        expect(updateResult.getIsFailing()).to.be.true;
    });
    
    it("should fail for not existing content definition", async () => {
        try {
            const contentDefinitionDTO = new ContentDefinitionDTO("some-id", "dummy");
             
            await contentDefinitionManager.updateContentDefinition(contentDefinitionDTO);
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal(`Content definition with id "some-id" not found.`);
        }
    });
});
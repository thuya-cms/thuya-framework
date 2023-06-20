import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("delete content field definition", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should delete the content field definition if exists", async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "field"));
        const deleteResult = await contentDefinitionManager.deleteContentFieldDefinitionByName("field");
        expect(deleteResult.getIsSuccessful(), deleteResult.getMessage()).to.be.true;
    });
    
    it("should fail for not existing data", async () => {
        try {
            await contentDefinitionManager.deleteContentFieldDefinitionByName("field");
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Content field definition not found in the database.");
        }
    });
});
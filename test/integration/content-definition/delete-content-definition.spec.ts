import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("delete content definition", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should delete existing content definition", async () => {
        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));

        const deleteResult = await contentDefinitionManager.deleteContentDefinitionByName("test-definition");
        expect(deleteResult.getIsSuccessful(), deleteResult.getMessage()).to.be.true;

        const readResult = await contentDefinitionManager.readContentDefinitionByName("test-definition");
        expect(readResult.getIsFailing()).to.be.true;
    });
    
    it("should fail for not existing content definition", async () => {
        try {
            await contentDefinitionManager.deleteContentDefinitionByName("not-existing");
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Not found.");
        }
    });
});
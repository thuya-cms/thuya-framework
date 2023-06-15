import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("read content field definition", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });
   
    
    it("should return existing content definition", async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "test-field"));

        const readResult = await contentDefinitionManager.readContentFieldDefinitionByName("test-field");
        expect(readResult.getIsSuccessful(), readResult.getMessage()).to.be.true;
    });
    
    it("should fail for not existing content definition", async () => {
        const readResult = await contentDefinitionManager.readContentDefinitionByName("test-field");
        expect(readResult.getIsFailing()).to.be.true;
    });
});
import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("read content definition", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    
    it("should return existing content definition", async () => {
        await contentDefinitionUtil.createContentDefinition(new ContentDefinitionDTO("", "test-definition"));

        const readResult = await contentDefinitionManager.readContentDefinitionByName("test-definition");
        expect(readResult.getIsSuccessful(), readResult.getMessage()).to.be.true;
    });
    
    it("should fail for not existing content definition", async () => {
        const readResult = await contentDefinitionManager.readContentDefinitionByName("test-definition");
        expect(readResult.getIsFailing()).to.be.true;
    });
});
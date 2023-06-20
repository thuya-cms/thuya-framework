import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("list content field definitions", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should return existing items", async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "test-field-1"));
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "test-field-2"));

        const listContentDefinitionsResult = await contentDefinitionManager.listContentFieldDefinitions();
        expect(listContentDefinitionsResult.getIsSuccessful(), listContentDefinitionsResult.getMessage()).to.be.true;
        expect(listContentDefinitionsResult.getResult()!.length).to.equal(2);
    });

    it("should return empty list if there are no content definitions", async () => {
        const listContentDefinitionsResult = await contentDefinitionManager.listContentDefinitions();
        expect(listContentDefinitionsResult.getIsSuccessful(), listContentDefinitionsResult.getMessage()).to.be.true;
        expect(listContentDefinitionsResult.getResult()).to.exist;
        expect(listContentDefinitionsResult.getResult()!.length).to.equal(0);
    });
});
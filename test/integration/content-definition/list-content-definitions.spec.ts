import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";
import contentDefinitionUtil from "../helper/content-definition-util";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";

describe("list content definitions", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should return existing items", async () => {
        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition-1"));
        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition-2"));

        const listContentDefinitionsResult = await contentDefinitionManager.listContentDefinitions();
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
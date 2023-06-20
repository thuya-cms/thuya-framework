import { expect } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("create content field definition", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should create field with valid data", async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "field-1"));
    });
    
    it("should fail with existing field name", async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "field-1"));
        
        const createContentFieldDefinitionResult = await contentDefinitionManager.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "field-1"));
        expect(createContentFieldDefinitionResult.getIsFailing()).to.be.true;
    });
    
    it("should fail with empty name", async () => {
        const createContentFieldDefinitionResult = await contentDefinitionManager.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", ""));
        expect(createContentFieldDefinitionResult.getIsFailing()).to.be.true;
    });
});
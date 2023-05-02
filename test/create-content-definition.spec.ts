import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";

describe("create content definition", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created wo fields", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        let createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsSuccessful(), true);
    });
    
    it("should fail for empty name", () => {
        let contentDefinition = new ContentDefinitionDTO("", "");
        let createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });

    it("should be created with one field", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        let createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        
        should().equal(createContentDefinitionResult.getIsSuccessful(), true);
    });
    
    it("should fail with duplicate fields", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        let createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });
});
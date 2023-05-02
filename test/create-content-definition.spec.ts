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
        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsSuccessful(), true);
    });
    
    it("should fail for empty name", () => {
        const contentDefinition = new ContentDefinitionDTO("", "");
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });

    it("should be created with one field", () => {
        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        
        should().equal(createContentDefinitionResult.getIsSuccessful(), true);
    });
    
    it("should fail with duplicate fields", () => {
        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });
});
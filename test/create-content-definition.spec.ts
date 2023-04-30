import { assert } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";

describe("Create content definition", () => {
    it("valid empty definition should be created", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinitionManager.createContentDefinition(contentDefinition);
    });
    
    it("should fail for empty name", () => {
        try {
            let contentDefinition = new ContentDefinitionDTO("", "");
            contentDefinitionManager.createContentDefinition(contentDefinition);

            assert.fail();
        }
        
        catch {
        }
    });

    it("valid definition with one field should be created", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        contentDefinitionManager.createContentDefinition(contentDefinition);
    });
    
    it("should fail with duplicate fields", () => {
        try {
            let contentDefinition = new ContentDefinitionDTO("", "test-definition");
            contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
            contentDefinitionManager.createContentDefinition(contentDefinition);
            contentDefinitionManager.createContentDefinition(contentDefinition);

            assert.fail();
        }

        catch {
        }
    });
});
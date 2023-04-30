import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import { ErrorCode } from "../content-management/domain/entity/content-definition";

describe("create content definition", () => {
    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created wo fields", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinitionManager.createContentDefinition(contentDefinition);
    });
    
    it("should fail for empty name", () => {
        try {
            let contentDefinition = new ContentDefinitionDTO("", "");
            contentDefinitionManager.createContentDefinition(contentDefinition);

            should().fail();
        }
        
        catch (error: any) {
            should().equal(error.code, ErrorCode.InvalidName);
        }
    });

    it("should be created with one field", () => {
        let contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
        contentDefinitionManager.createContentDefinition(contentDefinition);
    });
    
    it("should fail with duplicate fields", () => {
        try {
            let contentDefinition = new ContentDefinitionDTO("", "test-definition");
            contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
            contentDefinition.addContentField("test", new TextContentFieldDefinitionDTO("", "test-field"));
            contentDefinitionManager.createContentDefinition(contentDefinition);

            should().fail();
        }

        catch (error: any) {
            should().equal(error.code, ErrorCode.DuplicateField);
        }
    });
});
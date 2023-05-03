import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "./util/content-definition-util";

describe("create content definition", () => {
    beforeEach(() => {
        contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created wo fields", () => {
        contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));
    });
    
    it("should fail for empty name", () => {
        const contentDefinition = new ContentDefinitionDTO("", "");
        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });

    it("should be created with one field", () => {
        const testField = contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "test-field"));

        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", testField);

        contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));
    });
    
    it("should fail with duplicate fields", () => {
        const testField = contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "test-field"));

        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", testField);
        contentDefinition.addContentField("test", testField);

        const createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        should().equal(createContentDefinitionResult.getIsFailing(), true);
        should().equal(createContentDefinitionResult.getMessage(), `Field with name "test" is already added.`);
    });
});
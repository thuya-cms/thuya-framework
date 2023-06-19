import { expect, should } from "chai";
import contentDefinitionManager from "../../../content-management/app/content-definition-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("create content definition", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created wo fields", async () => {
        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));
    });
    
    it("should fail with existing name", async () => {
        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));
        
        const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(new ContentDefinitionDTO("", "test-definition"));
        expect(createContentDefinitionResult.getIsFailing()).to.be.true;
    });
    
    it("should fail for empty name", async () => {
        const contentDefinition = new ContentDefinitionDTO("", "");
        const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinition);

        should().equal(createContentDefinitionResult.getIsFailing(), true);
    });

    it("should be created with one field", async () => {
        const testField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "test-field"));

        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", testField);

        await contentDefinitionUtil.defineContent(new ContentDefinitionDTO("", "test-definition"));
    });
    
    it("should fail with duplicate fields", async () => {
        const testField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "test-field"));

        const contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("test", testField);
        contentDefinition.addContentField("test", testField);

        const createContentDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinition);
        should().equal(createContentDefinitionResult.getIsFailing(), true);
        should().equal(createContentDefinitionResult.getMessage(), `Field with name "test" is already added.`);
    });
});
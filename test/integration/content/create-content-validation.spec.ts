import { should } from "chai";
import contentManager from "../../../content-management/app/content-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";
import fieldWithFailingValidation from "../helper/content/field-with-failing-validation";

describe("validations when creating content", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));
    });
    
    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should fail with failing validation", async () => {
        const contentField = fieldWithFailingValidation;
        await contentDefinitionUtil.createContentFieldDefinition(contentField);

        const contentDefinition = new ContentDefinitionDTO("", "definition");
        contentDefinition.addContentField("fieldOne", contentField);
        await contentDefinitionUtil.createContentDefinition(contentDefinition);

        const createContentResult = await contentManager.createContent("definition", {
            fieldOne: "data1"
        });
        should().equal(createContentResult.getIsFailing(), true);
        should().equal(createContentResult.getMessage(), `Validation failed with data data1.`)
    });
});
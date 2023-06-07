import { should } from "chai";
import contentManager from "../../../content-management/app/content-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";
import fieldWithDetermination from "../helper/content/field-with-determination";

describe("determinations when creating content", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });
    
    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should update the value with determination", async () => {
        const contentField = fieldWithDetermination;
        await contentDefinitionUtil.defineContentField(contentField);

        const contentDefinition = new ContentDefinitionDTO("", "definition");
        contentDefinition.addContentField("fieldOne", contentField);
        await contentDefinitionUtil.defineContent(contentDefinition);

        const createContentResult = await contentManager.createContent("definition", {
            fieldOne: "data1"
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());
        
        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true, readContentResult.getMessage());

        const content = readContentResult.getResult();
        should().equal(content.fieldOne, "Updated data1");
    });
});
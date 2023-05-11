import { should } from "chai";
import { Result } from "../common";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "./util/content-definition-util";
import handlerAccessor from "../content-management/persistency/handler-accessor";

describe("validations when creating content", () => {
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });
    
    afterEach(() => {
        localContentManagementPersistency.clear();
        handlerAccessor.clear();
    });

    
    it("should fail with failing validation", async () => {
        const contentField = new TextContentFieldDefinitionDTO("", "field");
        contentField.addValidator((data) => {
            return Result.error(`Validation failed with data ${ data }.`);
        });
        await contentDefinitionUtil.defineContentField(contentField);

        const contentDefinition = new ContentDefinitionDTO("", "definition");
        contentDefinition.addContentField("fieldOne", contentField);
        await contentDefinitionUtil.defineContent(contentDefinition);

        const createContentResult = await contentManager.createContent("definition", {
            fieldOne: "data1"
        });
        should().equal(createContentResult.getIsFailing(), true);
        should().equal(createContentResult.getMessage(), `Validation failed with data data1.`)
    });
});
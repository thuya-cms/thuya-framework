import { should } from "chai";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "./util/content-definition-util";
import handlerAccessor from "../content-management/persistency/handler-accessor";

describe("determinations when creating content", () => {
    beforeEach(() => {
        contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
    });
    
    afterEach(() => {
        localContentManagementPersistency.clear();
        handlerAccessor.clear();
    });

    
    it("should update the value with determination", () => {
        const contentField = new TextContentFieldDefinitionDTO("", "field");
        contentField.addDetermination((data) => {
            return "Updated " + data;
        });
        contentDefinitionUtil.defineContentField(contentField);

        const contentDefinition = new ContentDefinitionDTO("", "definition");
        contentDefinition.addContentField("fieldOne", contentField);
        contentDefinitionUtil.defineContent(contentDefinition);

        const createContentResult = contentManager.createContent("definition", {
            fieldOne: "data1"
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());
        
        const readContentResult = contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true, readContentResult.getMessage());

        const content = readContentResult.getResult();
        should().equal(content.fieldOne, "Updated data1");
    });
});
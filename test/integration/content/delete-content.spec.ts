import { expect } from "chai";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import { contentManager } from "../../../content-management/app";
import contentDefinitionUtil from "../helper/content-definition-util";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";

describe("delete content", () => {
    let contentDefinition: ContentDefinitionDTO;
    let id: string;
    
    
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));

        const textField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field"));
        const numField = await contentDefinitionUtil.defineContentField(new NumericContentFieldDefinitionDTO("", "numeric-field-1"));
        const dateField = await contentDefinitionUtil.defineContentField(new DateContentFieldDefinitionDTO("", "date-field-1"));
        const arrayElementField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "array-content"));
        const arrayField = await contentDefinitionUtil.defineContentField(new ArrayContentFieldDefinitionDTO("", "array-field-1", arrayElementField));

        contentDefinition = new ContentDefinitionDTO("", "test-definition")
        contentDefinition.addContentField(
            "textField", 
            textField, 
            { isRequired: true, isUnique: true });

        contentDefinition.addContentField("numericField", numField);
        contentDefinition.addContentField("dateField", dateField);
        contentDefinition.addContentField("arrayField", arrayField);
        
        await contentDefinitionUtil.defineContent(contentDefinition);

        const textValue = "text-value";
        const numValue = 20;
        const dateValue = new Date().toISOString();
        const arrayValue = ["string1", "string2"];

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: textValue,
            numericField: numValue,
            dateField: dateValue,
            arrayField: arrayValue
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        id = createContentResult.getResult()!;
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should successfully delete existing content", async () => {
        const deleteResult = await contentManager.deleteContent(contentDefinition.getName(), id);
        expect(deleteResult.getIsSuccessful(), deleteResult.getMessage()).to.be.true;
    });
    
    it("should fail for not existing content", async () => {
        try {
            await contentManager.deleteContent(contentDefinition.getName(), "dummy-id");
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Content not found.");
        }
    });
});
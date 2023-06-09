import { expect, should } from "chai";
import { contentManager } from "../../../content-management/app";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";
import DateContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/date-content-field-definition";
import NumericContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("update content", () => {
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


    it("should be created with valid fields", async () => {
        const textValue = "text-value-2";
        const numValue = 30;
        const dateValue = new Date().toISOString();
        const arrayValue = ["string3", "string4"];

        const updateContentResult = await contentManager.updateContent(contentDefinition.getName(), {
            id: id,
            textField: textValue,
            numericField: numValue,
            dateField: dateValue,
            arrayField: arrayValue
        });
        expect(updateContentResult.getIsSuccessful(), updateContentResult.getMessage()).to.be.true;

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), id);
        expect(readContentResult.getIsSuccessful(), readContentResult.getMessage()).to.be.true;

        const content = readContentResult.getResult();
        expect(content).to.exist;
        expect(content.id).to.equal(id);
        expect(content.textField).to.equal(textValue);
        expect(content.numericField).to.equal(numValue);
        expect(content.dateField).to.equal(dateValue);
        expect(content.arrayField).to.equal(arrayValue);
    });

    it("should be created with missing not required fields", async () => {
        const textValue = "text-value-2";

        const updateContentResult = await contentManager.updateContent(contentDefinition.getName(), {
            id: id,
            textField: textValue
        });
        expect(updateContentResult.getIsSuccessful(), updateContentResult.getMessage()).to.be.true;

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), id);
        expect(readContentResult.getIsSuccessful(), readContentResult.getMessage()).to.be.true;

        const content = readContentResult.getResult();
        expect(content).to.exist;
        expect(content.id).to.equal(id);
        expect(content.textField).to.equal(textValue);
        expect(content.numericField).not.to.exist;
        expect(content.dateField).not.to.exist;
        expect(content.arrayField).not.to.exist;
    });

    it("should fail with missing required field", async () => {
        const updateContentResult = await contentManager.updateContent(contentDefinition.getName(), { id: id });
        expect(updateContentResult.getIsFailing()).to.be.true;
    });

    it("should fail with duplicate unique value", async () => {
        const newTextValue = "text-value-2";
        const originalTextValue = "text-value";

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), { textField: newTextValue });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        
        const updateContentResult = await contentManager.updateContent(contentDefinition.getName(), { id: id, textField: originalTextValue });
        expect(updateContentResult.getIsFailing()).to.be.true;
    }); 
});
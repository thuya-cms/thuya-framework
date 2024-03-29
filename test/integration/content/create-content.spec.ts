import { should } from "chai";
import contentManager from "../../../content-management/app/content-manager";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";
import BooleanContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/boolean-content-field-definition";

describe("create content", () => {    
    let contentDefinition: ContentDefinitionDTO;
    
    
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));

        const textField = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "text-field"));
        const numField = await contentDefinitionUtil.createContentFieldDefinition(new NumericContentFieldDefinitionDTO("", "numeric-field-1"));
        const dateField = await contentDefinitionUtil.createContentFieldDefinition(new DateContentFieldDefinitionDTO("", "date-field-1"));
        const booleanField = await contentDefinitionUtil.createContentFieldDefinition(new BooleanContentFieldDefinitionDTO("", "boolean-field-1"));
        const arrayElementField = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "array-content"));
        const arrayField = await contentDefinitionUtil.createContentFieldDefinition(new ArrayContentFieldDefinitionDTO("", "array-field-1", arrayElementField));

        contentDefinition = new ContentDefinitionDTO("", "test-definition")
        contentDefinition.addContentField(
            "textField", 
            textField, 
            { isRequired: true, isUnique: true, isImmutable: true });

        contentDefinition.addContentField("numericField", numField);
        contentDefinition.addContentField("dateField", dateField);
        contentDefinition.addContentField("booleanField", booleanField);
        contentDefinition.addContentField("arrayField", arrayField);
        
        await contentDefinitionUtil.createContentDefinition(contentDefinition);
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created with valid fields", async () => {
        const textValue = "text-value";
        const numValue = 20;
        const dateValue = new Date().toISOString();
        const arrayValue = ["string1", "string2"];

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: textValue,
            numericField: numValue,
            dateField: dateValue,
            arrayField: arrayValue,
            booleanField: true
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true, readContentResult.getMessage());

        const content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.textField, textValue);
        should().equal(content.numericField, numValue);
        should().equal(content.dateField, dateValue);
        should().equal(content.booleanField, true);
        should().equal(JSON.stringify(content.arrayField), JSON.stringify(arrayValue));
    });

    it("should be created with missing not required fields", async () => {
        const textValue = "text-value";

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: textValue
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true);

        const content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.textField, textValue);
        should().not.exist(content.numericField);
        should().not.exist(content.dateField);
        should().not.exist(content.arrayField);
    });

    it("should fail with missing required field", async () => {
        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {});
        should().equal(createContentResult.getIsFailing(), true);
    });

    it("should fail with duplicate unique value", async () => {
        const textValue = "text-value";

        let createContentResult = await contentManager.createContent(contentDefinition.getName(), { textField: textValue });
        should().equal(createContentResult.getIsSuccessful(), true);

        createContentResult = await contentManager.createContent(contentDefinition.getName(), { textField: textValue });
        should().equal(createContentResult.getIsFailing(), true);
    });
});
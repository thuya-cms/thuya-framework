import { should } from "chai";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/array-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "./util/content-definition-util";
import handlerAccessor from "../content-management/persistency/handler-accessor";

describe("create content", () => {    
    let contentDefinition: ContentDefinitionDTO;
    
    
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
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
        handlerAccessor.clear();
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
            arrayField: arrayValue
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
        should().equal(content.arrayField, arrayValue);
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
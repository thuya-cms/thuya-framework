import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/array-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";

describe("create content", () => {    
    let contentDefinition: ContentDefinitionDTO<any>;
    
    
    beforeEach(() => {
        contentDefinition = new ContentDefinitionDTO<any>("", "test-definition")
        contentDefinition.addContentField(
            "textField", 
            new TextContentFieldDefinitionDTO("", "text-field-1"), 
            { isRequired: true, isUnique: true });

        contentDefinition.addContentField("numericField", new NumericContentFieldDefinitionDTO("", "numeric-field-1"));
        contentDefinition.addContentField("dateField", new DateContentFieldDefinitionDTO("", "date-field-1"));
        contentDefinition.addContentField("arrayField", new ArrayContentFieldDefinitionDTO("", "array-field-1", new TextContentFieldDefinitionDTO("", "array-content")));
        
        let createContentDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        should().equal(createContentDefinitionResult.getIsSuccessful(), true);
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should be created with valid fields", () => {
        let textValue = "text-value";
        let numValue = 20;
        let dateValue = new Date().toISOString();
        let arrayValue = ["string1", "string2"];

        let createContentResult = contentManager.createContent(contentDefinition.getName(), {
            textField: textValue,
            numericField: numValue,
            dateField: dateValue,
            arrayField: arrayValue
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());

        let readContentResult = contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true, readContentResult.getMessage());

        let content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.textField, textValue);
        should().equal(content.numericField, numValue);
        should().equal(content.dateField, dateValue);
        should().equal(content.arrayField, arrayValue);
    });

    it("should be created with missing not required fields", () => {
        let textValue = "text-value";

        let createContentResult = contentManager.createContent(contentDefinition.getName(), {
            textField: textValue
        });
        if (createContentResult.getIsFailing())
            should().fail();

        let readContentResult = contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true);

        let content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.textField, textValue);
        should().not.exist(content.numericField);
        should().not.exist(content.dateField);
        should().not.exist(content.arrayField);
    });

    it("should fail with missing required field", () => {
        let createContentResult = contentManager.createContent(contentDefinition.getName(), {});
        should().equal(createContentResult.getIsFailing(), true);
    });

    it("should fail with duplicate unique value", () => {
        let textValue = "text-value";

        let createContentResult = contentManager.createContent(contentDefinition.getName(), { textField: textValue });
        should().equal(createContentResult.getIsSuccessful(), true);

        createContentResult = contentManager.createContent(contentDefinition.getName(), { textField: textValue });
        should().equal(createContentResult.getIsFailing(), true);
    });
});
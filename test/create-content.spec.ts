import { assert, should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import DateContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/date-content-field-definition";
import ArrayContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/array-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import { ErrorCode } from "../content-management/domain/usecase/content/create-content";

describe("create content", () => {    
    let contentDefinition: ContentDefinitionDTO<any>;
    

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    beforeEach(() => {
        contentDefinition = new ContentDefinitionDTO<any>("", "test-definition")
        contentDefinition.addContentField(
            "text-field", 
            new TextContentFieldDefinitionDTO("", "text-field-1"), 
            { isRequired: true, isUnique: true });

        contentDefinition.addContentField("numeric-field", new NumericContentFieldDefinitionDTO("", "numeric-field-1"));
        contentDefinition.addContentField("date-field", new DateContentFieldDefinitionDTO("", "date-field-1"));
        contentDefinition.addContentField("array-field", new ArrayContentFieldDefinitionDTO("", "array-field-1", new TextContentFieldDefinitionDTO("", "array-content")));

        contentDefinitionManager.createContentDefinition(contentDefinition);
    });


    it("should be created with valid fields", () => {
        let textValue = "text-value";
        let numValue = 20;
        let dateValue = new Date().toISOString();
        let arrayValue = ["string1", "string2"];

        let id = contentManager.createContent(contentDefinition.getName(), {
            textField: textValue,
            numericField: numValue,
            dateField: dateValue,
            arrayField: arrayValue
        });
        let content = contentManager.readContent(contentDefinition.getName(), id);

        should().exist(content);
        should().equal(content.id, id);
        should().equal(content.textField, textValue);
        should().equal(content.numericField, numValue);
        should().equal(content.dateField, dateValue);
        should().equal(content.arrayField, arrayValue);
    });

    it("should be created with missing not required fields", () => {
        let textValue = "text-value";

        let id = contentManager.createContent(contentDefinition.getName(), {
            textField: textValue
        });
        let content = contentManager.readContent(contentDefinition.getName(), id);

        should().exist(content);
        should().equal(content.id, id);
        should().equal(content.textField, textValue);
        should().not.exist(content.numericField);
        should().not.exist(content.dateField);
        should().not.exist(content.arrayField);
    });

    it("should fail with missing required field", () => {
        try {
            contentManager.createContent(contentDefinition.getName(), {});
            should().fail();
        }

        catch (error: any) {
            should().equal(error.code, ErrorCode.Required);
        }
    });

    it("should fail with duplicate unique value", () => {
        try {
            let textValue = "text-value";
    
            contentManager.createContent(contentDefinition.getName(), { textField: textValue });
            contentManager.createContent(contentDefinition.getName(), { textField: textValue });

            should().fail();
        }

        catch (error: any) {
            should().equal(error.code, ErrorCode.NotUnique);
        }
    });
});
import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import GroupContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";

describe("create content with group", () => {
    let contentDefinition: ContentDefinitionDTO<any>;
    let groupField: GroupContentFieldDefinitionDTO;

    
    beforeEach(() => {
        contentDefinition = new ContentDefinitionDTO<any>("", "test-definition");
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should create valid content", () => {
        let textValue = "text-value";
        let numValue = 30;

        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", new TextContentFieldDefinitionDTO("", "text-field-1"));
        groupField.addContentField("numericField", new NumericContentFieldDefinitionDTO("", "numeric-field-1"));

        contentDefinition.addContentField("groupField", groupField);
        
        let createResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        if (createResult.getIsFailing())
            should().fail(createResult.getMessage());

        let createContentResult = contentManager.createContent(contentDefinition.getName(), {
            groupField: {
                textField: textValue,
                numericField: numValue 
            }
        });
        if (createContentResult.getIsFailing())
            should().fail(createContentResult.getMessage());

        let readContentResult = contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true);

        let content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.groupField.textField, textValue);
        should().equal(content.groupField.numericField, numValue);
    });

    it("should fail with duplicate fields", () => {
        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", new TextContentFieldDefinitionDTO("", "text-field-1"));
        groupField.addContentField("textField", new TextContentFieldDefinitionDTO("", "text-field-2"));

        contentDefinition.addContentField("groupField", groupField);
        
        let createDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        if (createDefinitionResult.getIsSuccessful())
            should().fail(createDefinitionResult.getMessage());

        should().equal(createDefinitionResult.getMessage(), `Field with name "textField" is already added to group "group-field-1".`);
    });

    it("should fail with missing required value", () => {
        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", new TextContentFieldDefinitionDTO("", "text-field-1"), { isRequired: true });
        
        contentDefinition.addContentField("groupField", groupField);
        
        let createDefinitionResult = contentDefinitionManager.createContentDefinition(contentDefinition);
        if (createDefinitionResult.getIsFailing())
            should().fail(createDefinitionResult.getMessage());

        let createContentResult = contentManager.createContent(contentDefinition.getName(), {});

        should().equal(createContentResult.getIsFailing(), true);
    });
});
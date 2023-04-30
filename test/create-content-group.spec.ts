import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import GroupContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import { ErrorCode } from "../content-management/domain/entity/content-field-definition/group-content-field-definition";

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
        groupField.addContentField("text-field", new TextContentFieldDefinitionDTO("", "text-field-1"));
        groupField.addContentField("numeric-field", new NumericContentFieldDefinitionDTO("", "numeric-field-1"));

        contentDefinition.addContentField("group-field", groupField);
        contentDefinitionManager.createContentDefinition(contentDefinition);

        let id = contentManager.createContent(contentDefinition.getName(), {
            groupField: {
                textField: textValue,
                numericField: numValue 
            }
        });
        let content = contentManager.readContent(contentDefinition.getName(), id);

        should().exist(content);
        should().equal(content.id, id);
        should().equal(content.groupField.textField, textValue);
        should().equal(content.groupField.numericField, numValue);
    });

    it("should fail with duplicate fields", () => {
        try {
            groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
            groupField.addContentField("text-field", new TextContentFieldDefinitionDTO("", "text-field-1"));
            groupField.addContentField("text-field", new TextContentFieldDefinitionDTO("", "text-field-1"));
        }

        catch (error: any) {
            should().equal(error.code, ErrorCode.DuplicateField);
        }
    });

    it("should fail with missing required value", () => {
        try {
            groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
            groupField.addContentField("text-field", new TextContentFieldDefinitionDTO("", "text-field-1"), { isRequired: true });
            contentDefinitionManager.createContentDefinition(contentDefinition);

            contentManager.createContent(contentDefinition.getName(), {});
        }

        catch (error: any) {
            should().equal(error.code, ErrorCode.Required);
        }
    });
});
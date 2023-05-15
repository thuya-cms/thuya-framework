import { should } from "chai";
import contentDefinitionManager from "../content-management/app/content-definition-manager";
import contentManager from "../content-management/app/content-manager";
import ContentDefinitionDTO from "../content-management/app/dto/content-definition";
import GroupContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/group-content-field-definition";
import NumericContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "./util/content-definition-util";

describe("create content with group", () => {
    let contentDefinition: ContentDefinitionDTO;
    let groupField: GroupContentFieldDefinitionDTO;

    
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));
        contentDefinition = new ContentDefinitionDTO("", "test-definition");
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should create valid content", async () => {
        const textValue = "text-value";
        const numValue = 30;

        const textField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field-1"));
        const numField = await contentDefinitionUtil.defineContentField(new NumericContentFieldDefinitionDTO("", "numeric-field-1"));

        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", textField);
        groupField.addContentField("numericField", numField);
        await contentDefinitionUtil.defineContentField(groupField);

        contentDefinition.addContentField("groupField", groupField);
        await contentDefinitionUtil.defineContent(contentDefinition);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            groupField: {
                textField: textValue,
                numericField: numValue 
            }
        });
        should().equal(createContentResult.getIsSuccessful(), true, createContentResult.getMessage());

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        should().equal(readContentResult.getIsSuccessful(), true, readContentResult.getMessage());

        const content = readContentResult.getResult();
        should().exist(content);
        should().equal(content.id, createContentResult.getResult());
        should().equal(content.groupField.textField, textValue);
        should().equal(content.groupField.numericField, numValue);
    });

    it("should fail with duplicate fields", async () => {
        const textField1 = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field-1"));
        const textField2 = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field-2"));

        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", textField1);
        groupField.addContentField("textField", textField2);
        contentDefinition.addContentField("groupField", groupField);
        
        const createDefinitionResult = await contentDefinitionManager.createContentDefinition(contentDefinition);
        should().equal(createDefinitionResult.getIsFailing(), true);
        should().equal(createDefinitionResult.getMessage(), `Field with name "textField" is already added to group "group-field-1".`);
    });

    it("should fail with missing required value", async () => {
        const textField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field"));

        groupField = new GroupContentFieldDefinitionDTO("", "group-field-1");
        groupField.addContentField("textField", textField, { isRequired: true });
        await contentDefinitionUtil.defineContentField(groupField);

        contentDefinition.addContentField("groupField", groupField);
        await contentDefinitionUtil.defineContent(contentDefinition);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {});
        should().equal(createContentResult.getIsFailing(), true);
    });
});
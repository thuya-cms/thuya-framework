import { expect } from "chai";
import { contentManager } from "../../../content-management/app";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";
import GroupContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/group-content-field-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("create deep content", () => {
    let contentDefinition: ContentDefinitionDTO;

    
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));
        contentDefinition = new ContentDefinitionDTO("", "test-definition");
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });


    it("should create a group in an array", async () => {
        const textContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "text-field"));
        
        const groupContentFieldDefinition = new GroupContentFieldDefinitionDTO("", "group-field")
        groupContentFieldDefinition.addContentField("textField1", textContentFieldDefinition);
        groupContentFieldDefinition.addContentField("textField2", textContentFieldDefinition);
        await contentDefinitionUtil.createContentFieldDefinition(groupContentFieldDefinition);

        const arrayContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new ArrayContentFieldDefinitionDTO("", "array-field", groupContentFieldDefinition));
        
        contentDefinition.addContentField("arrayField", arrayContentFieldDefinition);
        await contentDefinitionUtil.createContentDefinition(contentDefinition);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            arrayField: [{
                textField1: "text-1",
                textField2: "text-2", 
                undefinedField: "notSaved"
            }, {
                textField1: "text-3",
                textField2: "text-4",
                undefinedField: "notSaved"
            }]
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        expect(readContentResult.getIsSuccessful(), readContentResult.getMessage()).to.be.true;

        const content = readContentResult.getResult()!;
        expect(content.id).to.equal(createContentResult.getResult()!);
        expect(content.arrayField.length).to.equal(2);

        const firstChild = content.arrayField[0];
        expect(firstChild.textField1).to.equal("text-1");
        expect(firstChild.textField2).to.equal("text-2");
        expect(firstChild.undefinedField).not.to.exist;
        
        const secondChild = content.arrayField[1];
        expect(secondChild.textField1).to.equal("text-3");
        expect(secondChild.textField2).to.equal("text-4");
        expect(secondChild.undefinedField).not.to.exist;
    });
    
    it("should create a group in a group", async () => {
        const textContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "text-field"));
        
        const childGroupContentFieldDefinition = new GroupContentFieldDefinitionDTO("", "child-group");
        childGroupContentFieldDefinition.addContentField("textField1", textContentFieldDefinition);
        childGroupContentFieldDefinition.addContentField("textField2", textContentFieldDefinition);
        await contentDefinitionUtil.createContentFieldDefinition(childGroupContentFieldDefinition);

        const parentGroupContentFieldDefinition = new GroupContentFieldDefinitionDTO("", "parent-group");
        parentGroupContentFieldDefinition.addContentField("textField", textContentFieldDefinition);
        parentGroupContentFieldDefinition.addContentField("childGroup", childGroupContentFieldDefinition);
        await contentDefinitionUtil.createContentFieldDefinition(parentGroupContentFieldDefinition);

        contentDefinition.addContentField("parentGroup", parentGroupContentFieldDefinition);
        await contentDefinitionUtil.createContentDefinition(contentDefinition);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            parentGroup: {
                textField: "text-1",
                undefinedField: "notSaved",
                childGroup: {
                    textField1: "text-2",
                    textField2: "text-3",
                    undefinedField: "notSaved"
                }
            }
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        expect(readContentResult.getIsSuccessful(), readContentResult.getMessage()).to.be.true;

        const content = readContentResult.getResult()!;
        expect(content.id).to.equal(createContentResult.getResult()!);
        expect(content.parentGroup.textField).to.equal("text-1");
        expect(content.parentGroup.undefinedField).not.to.exist;

        expect(content.parentGroup.childGroup.textField1).to.equal("text-2");
        expect(content.parentGroup.childGroup.textField2).to.equal("text-3");
        expect(content.parentGroup.childGroup.undefinedField).not.to.exist;
    });

    it("should create array > group > array > group", async () => {
        const textContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "text-field"));
        
        const childGroupContentFieldDefinition = new GroupContentFieldDefinitionDTO("", "child-group");
        childGroupContentFieldDefinition.addContentField("textField", textContentFieldDefinition);
        await contentDefinitionUtil.createContentFieldDefinition(childGroupContentFieldDefinition);

        const childArrayContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new ArrayContentFieldDefinitionDTO("", "child-array", childGroupContentFieldDefinition));
        
        const parentGroupContentFieldDefinition = new GroupContentFieldDefinitionDTO("", "parent-group");
        parentGroupContentFieldDefinition.addContentField("childArray", childArrayContentFieldDefinition);
        await contentDefinitionUtil.createContentFieldDefinition(parentGroupContentFieldDefinition);
        
        const parentArrayContentFieldDefinition = await contentDefinitionUtil.createContentFieldDefinition(new ArrayContentFieldDefinitionDTO("", "parent-array", parentGroupContentFieldDefinition));

        contentDefinition.addContentField("parentArray", parentArrayContentFieldDefinition);
        await contentDefinitionUtil.createContentDefinition(contentDefinition);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            parentArray: [{
                childArray: [{
                    textField: "text-1",
                    undefinedField: "notSaved"
                }, {
                    textField: "text-2",
                    undefinedField: "notSaved"
                }]
            }, {
                childArray: [{
                    textField: "text-3",
                    undefinedField: "notSaved"
                }, {
                    textField: "text-4",
                    undefinedField: "notSaved"
                }]
            }]
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        expect(readContentResult.getIsSuccessful(), readContentResult.getMessage()).to.be.true;

        const content = readContentResult.getResult()!;
        expect(content.id).to.equal(createContentResult.getResult()!);
        expect(content.parentArray.length).to.equal(2);
        
        const firstChild = content.parentArray[0];
        expect(firstChild.childArray.length).to.equal(2);

        const firstChildOfFirstChild = firstChild.childArray[0];
        expect(firstChildOfFirstChild.textField).to.equal("text-1");
        expect(firstChildOfFirstChild.undefinedField).not.to.exist;
        
        const secondChildOfFirstChild = firstChild.childArray[1];
        expect(secondChildOfFirstChild.textField).to.equal("text-2");
        expect(secondChildOfFirstChild.undefinedField).not.to.exist;

        const secondChild = content.parentArray[1];
        expect(secondChild.childArray.length).to.equal(2);

        const firstChildOfSecondChild = secondChild.childArray[0];
        expect(firstChildOfSecondChild.textField).to.equal("text-3");
        expect(firstChildOfSecondChild.undefinedField).not.to.exist;
        
        const secondChildOfSecondChild = secondChild.childArray[1];
        expect(secondChildOfSecondChild.textField).to.equal("text-4");
        expect(secondChildOfSecondChild.undefinedField).not.to.exist;
    });
});
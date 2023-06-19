import { expect } from "chai";
import { contentManager } from "../../../content-management/app";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";
import DateContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/date-content-field-definition";
import NumericContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("list content", () => {
    let contentDefinition: ContentDefinitionDTO;
    
    
    beforeEach(async () => {
        await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "id"));

        const textField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "text-field"));
        const numField = await contentDefinitionUtil.defineContentField(new NumericContentFieldDefinitionDTO("", "numeric-field-1"));
        const dateField = await contentDefinitionUtil.defineContentField(new DateContentFieldDefinitionDTO("", "date-field-1"));
        const arrayElementField = await contentDefinitionUtil.defineContentField(new TextContentFieldDefinitionDTO("", "array-content"));
        const arrayField = await contentDefinitionUtil.defineContentField(new ArrayContentFieldDefinitionDTO("", "array-field-1", arrayElementField));

        contentDefinition = new ContentDefinitionDTO("", "test-definition")
        contentDefinition.addContentField("textField", textField);
        contentDefinition.addContentField("numericField", numField);
        contentDefinition.addContentField("dateField", dateField);
        contentDefinition.addContentField("arrayField", arrayField);
        
        await contentDefinitionUtil.defineContent(contentDefinition);
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
    });

    
    it("should return all existing content", async () => {
        const originalContent = {
            arrayField: ["element1", "element2"],
            dateField: new Date(),
            id: "",
            numericField: 10,
            textField: "text"
        };
        let createContentResult = await contentManager.createContent(contentDefinition.getName(), originalContent);
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        createContentResult.getResult()!;
        
        createContentResult = await contentManager.createContent(contentDefinition.getName(), originalContent);
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        createContentResult.getResult()!;

        const listResult = await contentManager.listContent(contentDefinition.getName());
        expect(listResult.getIsSuccessful(), listResult.getMessage()).to.be.true;
        
        const contentList = listResult.getResult()!;
        expect(contentList.length).to.equal(2);
    });
    
    it("should return empty list without content", async () => {
        const listResult = await contentManager.listContent(contentDefinition.getName());
        expect(listResult.getIsSuccessful(), listResult.getMessage()).to.be.true;
        
        const contentList = listResult.getResult()!;
        expect(contentList).to.exist;
        expect(contentList.length).to.equal(0);
    });
    
    it("should return empty list for not existing content definition", async () => {
        const listResult = await contentManager.listContent("dummy");
        expect(listResult.getIsSuccessful(), listResult.getMessage()).to.be.true;
        
        const contentList = listResult.getResult()!;
        expect(contentList).to.exist;
        expect(contentList.length).to.equal(0);
    });
});
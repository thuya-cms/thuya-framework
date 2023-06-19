import { expect } from "chai";
import { contentManager } from "../../../content-management/app";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import ArrayContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/array-content-field-definition";
import DateContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/date-content-field-definition";
import NumericContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/numeric-content-field-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";

describe("read content", () => {
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
    });

    
    it("should be successful if content exists", async () => {
        const originalContent = {
            arrayField: ["element1", "element2"],
            dateField: new Date(),
            id: "",
            numericField: 10,
            textField: "text"
        };
        const createContentResult = await contentManager.createContent(contentDefinition.getName(), originalContent);
        expect(createContentResult.getIsSuccessful()).to.be.true;
        const id = createContentResult.getResult()!;

        const readResult = await contentManager.readContent(contentDefinition.getName(), id);
        expect(readResult.getIsSuccessful()).to.be.true;
        
        const content = readResult.getResult()!;
        expect(content.id).to.equal(id);
        expect(content.arrayField).to.equal(originalContent.arrayField);
        expect(content.dateField).to.equal(originalContent.dateField);
        expect(content.numericField).to.equal(originalContent.numericField);
        expect(content.textField).to.equal(originalContent.textField);
    });
    
    it("should return failing result for not existing content", async () => {
        const readResult = await contentManager.readContent(contentDefinition.getName(), "any-id");
        expect(readResult.getIsFailing()).to.be.true;
    });

    it("should be successful by field value if content exists", async () => {
        const originalContent = {
            arrayField: ["element1", "element2"],
            dateField: new Date(),
            id: "",
            numericField: 10,
            textField: "text"
        };
        const createContentResult = await contentManager.createContent(contentDefinition.getName(), originalContent);
        expect(createContentResult.getIsSuccessful()).to.be.true;
        const id = createContentResult.getResult()!;

        const readResult = await contentManager.readContentByFieldValue(contentDefinition.getName(), { name: "textField", value: "text" });
        expect(readResult.getIsSuccessful()).to.be.true;
        
        const content = readResult.getResult()!;
        expect(content.id).to.equal(id);
        expect(content.arrayField).to.equal(originalContent.arrayField);
        expect(content.dateField).to.equal(originalContent.dateField);
        expect(content.numericField).to.equal(originalContent.numericField);
        expect(content.textField).to.equal(originalContent.textField);
    });

    it("should return failing result read by field value for not existing content", async () => {
        const originalContent = {
            arrayField: ["element1", "element2"],
            dateField: new Date(),
            id: "",
            numericField: 10,
            textField: "text"
        };
        const createContentResult = await contentManager.createContent(contentDefinition.getName(), originalContent);
        expect(createContentResult.getIsSuccessful()).to.be.true;
        createContentResult.getResult()!;
        
        const readResult = await contentManager.readContentByFieldValue(contentDefinition.getName(), { name: "textField", value: "text-changed" });
        expect(readResult.getIsFailing()).to.be.true;
    });
});
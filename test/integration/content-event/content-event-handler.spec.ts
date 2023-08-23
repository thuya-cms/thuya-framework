import { expect } from "chai";
import { contentManager } from "../../../content-management/app";
import ContentDefinitionDTO from "../../../content-management/app/dto/content-definition/content-definition";
import TextContentFieldDefinitionDTO from "../../../content-management/app/dto/content-field-definition/text-content-field-definition";
import localContentManagementPersistency from "../../../content-management/persistency/local-content-management-persistency";
import contentDefinitionUtil from "../helper/content-definition-util";
import contentEventHandler from "../../../content-management/app/content-event-handler";
import contentEventHandlerService from "../../../content-management/service/content-event-handler";

describe("content event handler tests", () => {
    let contentDefinition: ContentDefinitionDTO;
    
    
    beforeEach(async () => {
        await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "id"));

        const textField = await contentDefinitionUtil.createContentFieldDefinition(new TextContentFieldDefinitionDTO("", "text-field"));

        contentDefinition = new ContentDefinitionDTO("", "test-definition");
        contentDefinition.addContentField("textField", textField);
        
        await contentDefinitionUtil.createContentDefinition(contentDefinition);
    });

    afterEach(() => {
        localContentManagementPersistency.clear();
        contentEventHandlerService.clear();
    });


    it("should call event handlers for create", async () => {
        const callback = async (contentDefinitionName: string, content: any): Promise<void> => {
            expect(contentDefinitionName).to.equal(contentDefinition.getName());
            expect(content).to.exist;
            expect(content.id).to.exist;
            expect(content.textField).to.equal("text-value");
        };
        contentEventHandler.subscribeContentCreated(contentDefinition.getName(), callback);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: "text-value"
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        return callback;
    });
    
    it("should call event handlers for update", async () => {
        const callback = async (contentDefinitionName: string, content: any): Promise<void> => {
            expect(contentDefinitionName).to.equal(contentDefinition.getName());
            expect(content).to.exist;
            expect(content.id).to.exist;
            expect(content.textField).to.equal("text-value-2");
        };
        contentEventHandler.subscribeContentUpdated(contentDefinition.getName(), callback);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: "text-value"
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        
        const updateContentResult = await contentManager.updateContent(contentDefinition.getName(), {
            id: createContentResult.getResult(),
            textField: "text-value-2"
        });
        expect(updateContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        return callback;
    });
    
    it("should call event handlers for delete", async () => {
        const callback = async (contentDefinitionName: string, id: string): Promise<void> => {
            expect(contentDefinitionName).to.equal(contentDefinition.getName());
            expect(id).to.exist;
        };
        contentEventHandler.subscribeContentDeleted(contentDefinition.getName(), callback);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: "text-value"
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        
        const deleteContentResult = await contentManager.deleteContent(contentDefinition.getName(), createContentResult.getResult()!);
        expect(deleteContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        return callback;
    });
    
    it("should call event handlers for read", async () => {
        const callback = async (contentDefinitionName: string, content: any): Promise<void> => {
            expect(contentDefinitionName).to.equal(contentDefinition.getName());
            expect(content).to.exist;
            expect(content.id).to.exist;
            expect(content.textField).to.equal("text-value");
        };
        contentEventHandler.subscribeContentRead(contentDefinition.getName(), callback);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: "text-value"
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        
        const readContentResult = await contentManager.readContent(contentDefinition.getName(), createContentResult.getResult()!);
        expect(readContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        return callback;
    });
    
    it("should call event handlers for list", async () => {
        const callback = async (contentDefinitionName: string, contents: any[]): Promise<void> => {
            expect(contentDefinitionName).to.equal(contentDefinition.getName());
            expect(contents).to.exist;
            expect(contents.length).to.equal(1);
            expect(contents[0].id).to.exist;
            expect(contents[0].textField).to.equal("text-value");
        };
        contentEventHandler.subscribeContentListed(contentDefinition.getName(), callback);

        const createContentResult = await contentManager.createContent(contentDefinition.getName(), {
            textField: "text-value"
        });
        expect(createContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;
        
        const listContentResult = await contentManager.listContent(contentDefinition.getName());
        expect(listContentResult.getIsSuccessful(), createContentResult.getMessage()).to.be.true;

        return callback;
    });
});
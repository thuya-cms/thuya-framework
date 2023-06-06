import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai, { expect } from 'chai';
import createContentFieldDefinition from '../../../../../../content-management/domain/usecase/content-definition/create-content-field-definition'
import contentDefinitionRepository from "../../../../../../content-management/repository/content-definition-repository";
import TextContentFieldDefinition from "../../../../../../content-management/domain/entity/content-field-definition/text-content-field-definition";

describe("unit tests for creating content field definition use case", () => {
    before(() => {
        chai.use(sinonChai);
    });
    
    afterEach(() => {
        sinon.restore();
    });


    it("should create content field definition if repository runs successfully", async () => {
        sinon.stub(contentDefinitionRepository, "createContentFieldDefinition").returns(Promise.resolve("dummy-id"));
        
        const contentFieldDefinition = instantiateContentFieldDefinition();
        const createResult = await createContentFieldDefinition.execute(contentFieldDefinition);
        expect(createResult.getIsSuccessful()).to.be.true;
        expect(createResult.getResult()).to.equal("dummy-id");
    });
    
    it("should raise exception if repository raises exception", async () => {
        try {
            sinon.stub(contentDefinitionRepository, "createContentFieldDefinition").throws(new Error("Failed to create."));
            
            const contentFieldDefinition = instantiateContentFieldDefinition();
            await createContentFieldDefinition.execute(contentFieldDefinition);
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Failed to create.");
        }
    });
});

function instantiateContentFieldDefinition(): TextContentFieldDefinition {
    const contentFieldDefinitionResult = TextContentFieldDefinition.create("", "test");
    expect(contentFieldDefinitionResult.getIsSuccessful()).to.be.true;
    
    return contentFieldDefinitionResult.getResult()!;
}
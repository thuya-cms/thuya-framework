import sinon from 'sinon';
import contentDefinitionRepository from '../../../../../../content-management/repository/content-definition-repository'
import createContentDefinition from '../../../../../../content-management/domain/usecase/content-definition/create-content-definition'
import { ContentDefinition } from '../../../../../../content-management/domain/entity/content-definition';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

describe("unit tests for create content definition use case", () => {
    before(() => {
        chai.use(sinonChai);
    });
    
    afterEach(() => {
        sinon.restore();
    });

    
    it("should be successful if persistency is successful", async () => {
        sinon.stub(contentDefinitionRepository, "createContentDefinition").returns(Promise.resolve("dummy-id"));
        
        const contentDefinition = instantiateContentDefinition();

        const result = await createContentDefinition.execute(contentDefinition);
        expect(result.getIsSuccessful()).to.be.true;
        expect(result.getResult()).to.equal("dummy-id");
    });
    
    it("should raise exception if persistency fails with exception", async () => {
        try {
            sinon.stub(contentDefinitionRepository, "createContentDefinition").throws(new Error("Persistency failed."));
            
            const contentDefinition = instantiateContentDefinition();
    
            await createContentDefinition.execute(contentDefinition);
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Persistency failed.");
        }
    });
});

function instantiateContentDefinition(): ContentDefinition {
    const contentDefinitionResult = ContentDefinition.create("", "test");
    expect(contentDefinitionResult.getIsSuccessful()).to.be.true;
    
    return contentDefinitionResult.getResult()!;
}

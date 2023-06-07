import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import createContentDefinition from '../../../../content-management/domain/usecase/content-definition/create-content-definition'
import contentDefinitionManager from '../../../../content-management/app/content-definition-manager'
import { Result } from '../../../../common';
import ContentDefinitionDTO from '../../../../content-management/app/dto/content-definition';
import { ContentDefinition } from '../../../../content-management/domain/entity/content-definition';

describe("unit tests for content definition manager - create content definition", () => {
    before(() => {
        chai.use(sinonChai);
    });
    
    afterEach(() => {
        sinon.restore();
    });


    it("should create content definition with valid data", async () => {
        const executeStub = sinon.stub(createContentDefinition, "execute").returns(Promise.resolve(Result.success("dummy-id")));
        
        const contentDefinition = instantiateContentDefinitionWithoutFields();

        const createResult = await contentDefinitionManager.createContentDefinition(contentDefinition.dto);
        expect(createResult.getIsSuccessful()).to.be.true;
        expect(createResult.getResult()).to.equal("dummy-id");
        expect(executeStub).to.be.calledWith(contentDefinition.entity);
    });
    
    it("should fail when create use case fails", async () => {
        sinon.stub(createContentDefinition, "execute").returns(Promise.resolve(Result.error("Create failed.")));
        
        const contentDefinition = instantiateContentDefinitionWithoutFields();

        const createResult = await contentDefinitionManager.createContentDefinition(contentDefinition.dto);
        expect(createResult.getIsFailing()).to.be.true;
        expect(createResult.getMessage()).to.equal("Create failed.");
    });
    
    it("should throw exception if create use case throws exception", async () => {
        try {
            sinon.stub(createContentDefinition, "execute").throws(new Error("Create failed."));
            
            const contentDefinition = instantiateContentDefinitionWithoutFields();
    
            await contentDefinitionManager.createContentDefinition(contentDefinition.dto);
            expect.fail();
        }

        catch (error: any) {
            expect(error.message).to.equal("Create failed.");
        }
    });
});

describe("unit tests for content definition manager - create content field definition", () => {
    before(() => {
        chai.use(sinonChai);
    });
    
    afterEach(() => {
        sinon.restore();
    });


    
});

function instantiateContentDefinitionWithoutFields(): { dto: ContentDefinitionDTO, entity: ContentDefinition } {
    const contentDefinitionDTO = new ContentDefinitionDTO("", "test");
    const contentDefinitionResult = ContentDefinition.create("", "test");

    return {
        dto: contentDefinitionDTO,
        entity: contentDefinitionResult.getResult()!
    }
}
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai, { expect } from 'chai';
import readContentDefinition from '../../../../../../content-management/domain/usecase/content-definition/read-content-definition'
import contentDefinitionRepository from "../../../../../../content-management/repository/content-definition-repository";
import { ContentDefinition } from "../../../../../../content-management/domain/entity/content-definition";

describe("unit tests for reading content definition use case", () => {
    before(() => {
        chai.use(sinonChai);
    });
    
    afterEach(() => {
        sinon.restore();
    });


    it("should be successful for existing content definition", async () => {
        const contentDefinition = instantiateContentDefinition();

        sinon.stub(contentDefinitionRepository, "readContentDefinition").returns(Promise.resolve(contentDefinition));

        const readContentDefinitionResult = await readContentDefinition.execute("test");
        expect(readContentDefinitionResult.getIsSuccessful()).to.be.true;
        expect(readContentDefinitionResult.getResult()).to.equal(contentDefinition);
    });
    
    it("should return undefined if repository throws error", async () => {
        sinon.stub(contentDefinitionRepository, "readContentDefinition").throws(new Error("Failed to read."));

        const readContentDefinitionResult = await readContentDefinition.execute("test");
        expect(readContentDefinitionResult.getIsFailing()).to.be.true;
        expect(readContentDefinitionResult.getResult()).not.to.exist;
    });
    
    it("should return undefined if repository returns undefined", async () => {
        sinon.stub(contentDefinitionRepository, "readContentDefinition").returns(Promise.resolve());

        const readContentDefinitionResult = await readContentDefinition.execute("test");
        expect(readContentDefinitionResult.getIsFailing()).to.be.true;
        expect(readContentDefinitionResult.getResult()).not.to.exist;
    });
});

function instantiateContentDefinition(): ContentDefinition {
    const contentDefinitionResult = ContentDefinition.create("", "test");
    expect(contentDefinitionResult.getIsSuccessful()).to.be.true;
    
    return contentDefinitionResult.getResult()!;
}
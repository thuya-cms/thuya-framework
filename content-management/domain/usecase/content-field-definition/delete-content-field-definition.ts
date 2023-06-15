import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";

class DeleteContentFieldDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(DeleteContentFieldDefinition.name);
    }

    
    
    async byName(contentFieldDefinitionName: string): Promise<Result> {
        this.logger.debug(`Deleting content field definition "%s"...`, contentFieldDefinitionName);
        
        try {
            await contentDefinitionRepository.deleteContentFieldDefinitionByName(contentFieldDefinitionName);
            
            this.logger.debug(`...Content field definition "%s" deleted successfully.`, contentFieldDefinitionName);
            return Result.success();
        }
        
        catch (error) {
            this.logger.debug(`...Failed to delete content field definition "%s".`, contentFieldDefinitionName);
            throw error;
        }
    }
}

export default new DeleteContentFieldDefinition();
import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from '../../../repository/content-definition-repository';

/**
 * Use case to delete a content definition.
 */
class DeleteContentDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(DeleteContentDefinition.name);
    }


    
    /**
     * Delete a content definition by name.
     * 
     * @param contentDefinitionName the content definition name
     * @returns result
     * @async
     */
    async byName(contentDefinitionName: string): Promise<Result> {
        this.logger.debug(`Deleting content definition "%s"...`, contentDefinitionName);
        
        try {
            await contentDefinitionRepository.deleteContentDefinitionByName(contentDefinitionName);

            this.logger.debug(`...Deleted content definition "%s".`, contentDefinitionName);
            return Result.success();
        }
        
        catch (error) {
            this.logger.debug(`...Failed to delete content definition "%s".`, contentDefinitionName);
            throw error;
        }
    }
}

export default new DeleteContentDefinition();
import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition";

/**
 * Use case to list content definitions.
 */
class ListContentDefinitions {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ListContentDefinitions.name);
    }

    
    
    async execute(): Promise<Result<ContentDefinition[]>> {
        this.logger.debug("Listing content definitions...");
        
        try {
            const contentDefinitions = await contentDefinitionRepository.listContentDefinitions();
            
            this.logger.debug("...Successfully listed content definitions.");
            return Result.success(contentDefinitions);
        }
        
        catch (error) {
            this.logger.debug("...Failed to list content definitions.");
            throw error;
        }
    }
}

export default new ListContentDefinitions();
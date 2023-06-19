import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";

/**
 * Use case to list content field definitions.
 */
class ListContentFieldDefinitions {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ListContentFieldDefinitions.name);
    }

    
    
    /**
     * Execute listing content field definitions.
     * 
     * @returns result containing the list of content field definitions
     * @async
     */
    async execute(): Promise<Result<ContentFieldDefinition[]>> {
        this.logger.debug("Listing content field definitions...");
        
        try {
            const contentFieldDefinitions = await contentDefinitionRepository.listContentFieldDefinitions();
            
            this.logger.debug("...Successfully listed content field definitions.");
            return Result.success(contentFieldDefinitions);
        }
        
        catch (error) {
            this.logger.debug("...Failed to list content field definitions.");
            throw error;
        }
    }
}

export default new ListContentFieldDefinitions();
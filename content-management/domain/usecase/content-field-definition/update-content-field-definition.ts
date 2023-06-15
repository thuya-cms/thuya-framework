import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";

/**
 * Use case to update a content field definition.
 */
class UpdateContentFieldDefinition {    
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(UpdateContentFieldDefinition.name);
    }



    /**
     * Execute update of a content field definition.
     * 
     * @param contentFieldDefinition the content field definition
     * @returns result
     * @async
     */
    async execute(contentFieldDefinition: ContentFieldDefinition): Promise<Result> {
        this.logger.debug(`Start updating content field definition "%s"...`, contentFieldDefinition.getName());
        
        try {
            await contentDefinitionRepository.updateContentFieldDefinition(contentFieldDefinition);
    
            this.logger.debug(`...Content field definition "%s" updated successfully.`, contentFieldDefinition.getName());
            return Result.success();
        }

        catch (error) {
            this.logger.debug(`...Failed to update content field "%s".`, contentFieldDefinition.getName());
            throw error;
        }
    }
}

export default new UpdateContentFieldDefinition();
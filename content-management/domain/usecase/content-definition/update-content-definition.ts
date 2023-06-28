import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition/content-definition";

/**
 * Use case to update a content definition.
 */
class UpdateContentDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(UpdateContentDefinition.name);
    }



    /**
     * Execute content definition update.
     * 
     * @param contentDefinition the updated content definition
     * @returns result
     * @async
     */
    async execute(contentDefinition: ContentDefinition): Promise<Result> {
        this.logger.debug(`Start updating content definition "%s"...`, contentDefinition.getName());
        
        try {
            const existingContentDefinition = await contentDefinitionRepository.readContentDefinitionByName(contentDefinition.getName());
            if (!existingContentDefinition) {
                this.logger.debug(`Content definition "%s" does not exist.`, contentDefinition.getName());
                return Result.error(`Content definition "${ contentDefinition.getName() }" does not exist.`);
            }

            if (existingContentDefinition.getName() !== contentDefinition.getName()) {
                this.logger.debug(`Name of a content definition cannot be changed.`);
                return Result.error(`Name of a content definition cannot be changed.`);
            }

            await contentDefinitionRepository.updateContentDefinition(contentDefinition);
    
            this.logger.debug(`...Content definition "%s" updated successfully.`, contentDefinition.getName());
            return Result.success();
        }
        
        catch (error) {
            this.logger.error(`...Update of content definition "%s" failed.`, contentDefinition.getName());
            throw error;
        }
    }
}

export default new UpdateContentDefinition();
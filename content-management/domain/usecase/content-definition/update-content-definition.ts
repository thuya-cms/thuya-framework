import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition";

class UpdateContentDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(UpdateContentDefinition.name);
    }



    async execute(contentDefinition: ContentDefinition): Promise<Result> {
        this.logger.debug(`Start updating content definition "%s"...`, contentDefinition.getName());
        
        try {
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
import { ContentDefinition } from "../../entity/content-definition/content-definition";
import factory from "../../factory";
import { Logger, Result } from "../../../../common";
import modifyHelper from "./util/modify-helper";

/**
 * Use case to update a content.
 */
class UpdateContent<T extends { id: string }> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(UpdateContent.name);
    }


    
    /**
     * Execute content update.
     * 
     * @param contentDefinition the content definition of the content 
     * @param content the content data
     * @returns result
     */
    async execute(contentDefinition: ContentDefinition<T>, content: T): Promise<Result> {
        this.logger.debug(`Updating content of type "%s"...`, contentDefinition.getName());

        try {
            const convertAndValidateContentResult = await modifyHelper.convertAndValidateData(contentDefinition, content);
            if (convertAndValidateContentResult.getIsFailing())  {
                this.logger.debug(`...Failed to create content of type "%s".`, contentDefinition.getName());
                return Result.error(convertAndValidateContentResult.getMessage());
            }
    
            await factory.getContentPersistency().updateContent(contentDefinition.getName(), convertAndValidateContentResult.getResult());
            
            this.logger.debug(`...Content of type "%s" is updated successfully.`, contentDefinition.getName());
            return Result.success();
        }

        catch (error) {
            this.logger.error(`...Failed to update content of type "%s".`, contentDefinition.getName());
            throw error;
        }
    }
}

export default new UpdateContent();
import { ContentDefinition } from "../../entity/content-definition/content-definition";
import factory from "../../factory";
import { Logger, Result } from "../../../../common";
import modifyHelper from "./util/modify-helper";
import { contentManager } from "../../../app";

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
            if (!content.id) {
                this.logger.debug("Id is required for update.");
                return Result.error("Id is required for update.");
            }

            const readExistingContentResult = await contentManager.readContent(contentDefinition.getName(), content.id);
            if (readExistingContentResult.getIsFailing()) {
                this.logger.debug(`Content with id "%s" does not exist.`, content.id);
                return Result.error(`Content with id "${ content.id }" does not exist.`);
            }

            const existingContent = readExistingContentResult.getResult()!;
            for (const contentField of contentDefinition.getContentFields()) {
                if (!contentField.options.isImmutable) {
                    existingContent[contentField.name] = (content as any)[contentField.name];
                }
            }
            
            const convertAndValidateContentResult = await modifyHelper.convertAndValidateData(contentDefinition, existingContent);
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
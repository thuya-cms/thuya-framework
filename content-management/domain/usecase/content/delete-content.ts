import { Result, Logger } from "../../../../common";
import factory from "../../factory";

/**
 * Use case to delete a content.
 */
class DeleteContent {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(DeleteContent.name);
    }



    /**
     * Execute content deletion.
     * 
     * @param contentDefinitionName name of the content definition
     * @param id id of the content to delete
     * @returns result
     * @async
     */
    async execute(contentDefinitionName: string, id: string): Promise<Result> {
        this.logger.debug(`Start deleting content for definition "%s"...`, contentDefinitionName);

        try {
            await factory.getContentPersistency().deleteContent(contentDefinitionName, id);
            
            factory.getContentEventHandler().raiseContentDeleted(contentDefinitionName, id)
            this.logger.debug(`...Content of type "%s" deleted successfully.`, contentDefinitionName);
            return Result.success();
        }

        catch (error) {
            this.logger.error(`...Failed to delete content of type "%s".`, contentDefinitionName);
            throw error;
        }
    }
}

export default new DeleteContent();
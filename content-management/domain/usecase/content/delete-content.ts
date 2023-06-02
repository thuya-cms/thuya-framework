import { Result, Logger } from "../../../../common";
import factory from "../../factory";

/**
 * Use case to delete a content.
 */
class DeleteContent {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(DeleteContent.toString());
    }



    /**
     * Execute content deletion.
     * 
     * @param contentName name of the content definition
     * @param id id of the content to delete
     * @returns result
     */
    async execute(contentName: string, id: string): Promise<Result> {
        this.logger.debug(`Start deleting content for definition "%s"...`, contentName);

        try {
            await factory.getContentPersistency().deleteContent(contentName, id);
            
            this.logger.debug(`...Content of type "%s" deleted successfully.`, contentName);
            return Result.success();
        }

        catch (error) {
            this.logger.error(`...Failed to delete content of type "%s".`, contentName);
            throw error;
        }
    }
}

export default new DeleteContent();
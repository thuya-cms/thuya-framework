import { Result, Logger } from "../../../../common";
import factory from "../../factory";

/**
 * Use case to list contents of a content definition.
 */
class ListContent<T extends { id: string } = any> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ListContent.toString());
    }


    
    /**
     * Execute the listing of contents for a content definition.
     * 
     * @param contentName name of the content definition to use for content listing
     * @returns result containing the list of contents
     */
    async execute(contentName: string): Promise<Result<T[]>> {
        this.logger.debug(`Listing content for "%s"...`, contentName);

        try {
            const contentList = await factory.getContentPersistency().listContent(contentName);

            this.logger.debug(`...Successfully listed content for "%s".`, contentName);
            return Result.success(contentList);
        }

        catch (error) {
            this.logger.error(`...Failed to list content for "%s".`, contentName);
            throw error;
        }
    }
}

export default new ListContent();
import { Result, Logger } from "../../../../common";
import factory from "../../factory";

/**
 * Use case to list contents of a content definition.
 */
class ListContent<T extends { id: string } = any> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ListContent.name);
    }


    
    /**
     * Execute the listing of contents for a content definition.
     * 
     * @param contentDefinitionName name of the content definition to use for content listing
     * @returns result containing the list of contents
     * @async
     */
    async execute(contentDefinitionName: string): Promise<Result<T[]>> {
        this.logger.debug(`Listing content for "%s"...`, contentDefinitionName);

        try {
            const contentList = await factory.getContentPersistency().listContent(contentDefinitionName);

            factory.getContentEventHandler().raiseContentListed(contentDefinitionName, contentList);
            this.logger.debug(`...Successfully listed content for "%s".`, contentDefinitionName);
            return Result.success(contentList);
        }

        catch (error) {
            this.logger.error(`...Failed to list content for "%s".`, contentDefinitionName);
            throw error;
        }
    }

    /**
     * List content by field value.
     * 
     * @param contentDefinitionName name of the content definition
     * @param fieldValue field key and value
     * @param fieldValue.name field key
     * @param fieldValue.value field value
     * @returns result containing all content matching the field value
     * @async
     */
    async byFieldValue(contentDefinitionName: string, fieldValue: { name: string, value: any }): Promise<Result<T[]>> {
        this.logger.debug(`Listing content for "%s" by field value "%s":"%s"...`, contentDefinitionName, fieldValue.name, fieldValue.value);
        
        try {
            const content = await factory.getContentPersistency().listContentByFieldValue(contentDefinitionName, fieldValue);
            
            this.logger.debug(`...Successfully listed content for "%s" by field value "%s":"%s".`, contentDefinitionName, fieldValue.name, fieldValue.value);
            return Result.success(content);
        }
        
        catch (error) {
            this.logger.error(`...Failed to list content for "%s" by field value "%s":"%s".`, contentDefinitionName, fieldValue.name, fieldValue.value);
            throw error;
        }
    }
}

export default new ListContent();
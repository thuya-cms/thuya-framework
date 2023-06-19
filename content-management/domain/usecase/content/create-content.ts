import { ContentDefinition } from "../../entity/content-definition/content-definition";
import factory from "../../factory";
import { Logger, Result } from "../../../../common";
import modifyHelper from "./util/modify-helper";

/**
 * Use case to create content.
 */
class CreateContent<T> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(CreateContent.name);
    }



    /**
     * Execute content creation.
     * 
     * @param contentDefinition the content definition of the content
     * @param content the content data
     * @returns result containing the id of the created content
     */
    async execute(contentDefinition: ContentDefinition<T>, content: T): Promise<Result<string>> {
        this.logger.debug(`Start creating content of type "%s"...`, contentDefinition.getName());

        try {
            const finalContentResult = await modifyHelper.convertData(contentDefinition, content);
            if (finalContentResult.getIsFailing())  {
                this.logger.debug(`...Failed to create content of type "%s".`, contentDefinition.getName());
                return Result.error(finalContentResult.getMessage());
            }
    
            const indexedFields = contentDefinition.getContentFields()
                .filter(contentField => contentField.options.isIndexed)
                .map(contentField => contentField.name);
    
            const id = await factory.getContentPersistency().createContent(contentDefinition.getName(), finalContentResult.getResult(), {
                indexedFields: indexedFields
            });
    
            this.logger.debug(`...Content of type "%s" created successfully.`, contentDefinition.getName());
            return Result.success(id);
        }

        catch (error) {
            this.logger.error(`...Failed to create content of type "%s".`, contentDefinition.getName());
            throw error;
        }
    }
}

export default new CreateContent();
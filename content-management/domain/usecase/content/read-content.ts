import { Result, Logger } from "../../../../common";
import factory from "../../factory";

/**
 * Use cases to read content.
 */
class ReadContent<T extends { id: string } = any> {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ReadContent.name);
    }


    
    /**
     * Read content by id.
     * 
     * @param contentName name of the content definition
     * @param id id of the content
     * @returns result containing the content
     */
    async byId(contentName: string, id: string): Promise<Result<T>> {
        this.logger.debug(`Reading content for "%s" by is "%s"...`, contentName, id);
        
        try {
            const content = await factory.getContentPersistency().readContent(contentName, id);

            if (content) {
                this.logger.debug(`...Successfully read content of type "%s".`, contentName);
                return Result.success(content);
            }

            this.logger.debug(`...Content of type "%s" not found.`, contentName);
            return Result.error("Content not found.");
        }

        catch (error) {
            this.logger.debug(`...Failed to read content of type "%s".`, contentName);
            throw error;
        }
    }

    /**
     * Read a single content by field value.
     * 
     * @param contentName name of the content definition
     * @param fieldValue field key and value
     * @param fieldValue.name field key
     * @param fieldValue.value field value
     * @returns result containing the content
     */
    async byFieldValue(contentName: string, fieldValue: { name: string, value: any }): Promise<Result<T>> {
        this.logger.debug(`Reading content for "%s" by field value "%s":"%s"...`, contentName, fieldValue.name, fieldValue.value);
        
        try {
            const content = await factory.getContentPersistency().readContentByFieldValue(fieldValue, contentName);

            if (content) {
                this.logger.debug(`...Successfully read content for "%s" by field value "%s":"%s".`, contentName, fieldValue.name, fieldValue.value);
                return Result.success(content);
            }
            
            this.logger.debug(`...Content not found for "%s" by field value "%s":"%s".`, contentName, fieldValue.name, fieldValue.value);
            return Result.error("Content not found.");
        }
        
        catch (error) {
            this.logger.error(`...Failed to read content for "%s" by field value "%s":"%s".`, contentName, fieldValue.name, fieldValue.value);
            throw error;
        }
    }
}

export default new ReadContent();
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
     * @param contentDefinitionName name of the content definition
     * @param id id of the content
     * @returns result containing the content
     * @async
     */
    async byId(contentDefinitionName: string, id: string): Promise<Result<T>> {
        this.logger.debug(`Reading content for "%s" by is "%s"...`, contentDefinitionName, id);
        
        try {
            const content = await factory.getContentPersistency().readContentById(contentDefinitionName, id);
            if (!content) {
                this.logger.debug(`...Content of type "%s" not found.`, contentDefinitionName);
                return Result.error(`...Failed to read content of type "${ contentDefinitionName }".`);
            }
            
            factory.getContentEventHandler().raiseContentRead(contentDefinitionName, content);
            this.logger.debug(`...Successfully read content of type "%s".`, contentDefinitionName);
            return Result.success(content);
        }

        catch (error) {
            this.logger.debug(`...Failed to read content of type "%s".`, contentDefinitionName);
            throw error;
        }
    }

    /**
     * Read a single content by field value.
     * 
     * @param contentDefinitionName name of the content definition
     * @param fieldValue field key and value
     * @param fieldValue.name field key
     * @param fieldValue.value field value
     * @returns result containing the content
     * @async
     */
    async byFieldValue(contentDefinitionName: string, fieldValue: { name: string, value: any }): Promise<Result<T>> {
        this.logger.debug(`Reading content for "%s" by field value "%s":"%s"...`, contentDefinitionName, fieldValue.name, fieldValue.value);
        
        try {
            const content = await factory.getContentPersistency().readContentByFieldValue(contentDefinitionName, fieldValue);
            if (!content) {
                this.logger.debug(`...Content not found for "%s" by field value "%s":"%s".`, contentDefinitionName, fieldValue.name, fieldValue.value);
                return Result.error(`...Failed to read content for "${ contentDefinitionName }" by field value "${ fieldValue.name }":${ fieldValue.value }".`);
            }
            
            this.logger.debug(`...Successfully read content for "%s" by field value "%s":"%s".`, contentDefinitionName, fieldValue.name, fieldValue.value);
            return Result.success(content);
        }
        
        catch (error) {
            this.logger.error(`...Failed to read content for "%s" by field value "%s":"%s".`, contentDefinitionName, fieldValue.name, fieldValue.value);
            throw error;
        }
    }
}

export default new ReadContent();
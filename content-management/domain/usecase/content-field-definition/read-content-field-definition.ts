import { Logger, Result } from "../../../../common";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";

/**
 * Use case to read a content field definition.
 */
class ReadContentFieldDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ReadContentFieldDefinition.name);
    }



    /**
     * Execute reading a content field definition by name.
     * 
     * @param contentFieldDefinitionName name of the content field definition
     * @returns the content field definition or undefined
     * @async
     */
    async byName(contentFieldDefinitionName: string): Promise<Result<ContentFieldDefinition | undefined>> {
        this.logger.debug(`Start reading content field definition "%s"...`, contentFieldDefinitionName);

        try {
            const contentFieldDefinition = await contentDefinitionRepository.readContentFieldDefinitionByName(contentFieldDefinitionName);
            if (!contentFieldDefinition) {
                this.logger.debug(`...Content field definition not found.`);
                return Result.error(`Content field definition "${ contentFieldDefinitionName }" not found.`);
            }
    
            this.logger.debug(`...Content field definition "%s" found.`, contentFieldDefinitionName);
            return Result.success(contentFieldDefinition);
        }

        catch (error) {
            this.logger.debug(`...Failed to read content field definition "%s".`, contentFieldDefinitionName);
            throw error;
        }
    }
}

export default new ReadContentFieldDefinition();
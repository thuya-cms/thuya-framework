import { Result } from "../../../../common";
import Logger from "../../../../common/utility/logger";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentFieldDefinition } from "../../entity/content-field-definition/content-field-definition";

/**
 * Use case to create a content field definition.
 */
class CreateContentFieldDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(CreateContentFieldDefinition.name);
    }



    /**
     * Execute content field definition creation.
     * 
     * @param contentFieldDefinition the content field definition to create
     * @returns result containing the id of the created content field definition
     * @async
     */
    async execute(contentFieldDefinition: ContentFieldDefinition): Promise<Result<string>> {
        this.logger.debug(`Start creating content field definition "%s"...`, contentFieldDefinition.getName());
        
        try {
            const existingContentFieldDefinition = await contentDefinitionRepository.readContentFieldDefinitionByName(contentFieldDefinition.getName());
            if (existingContentFieldDefinition) {
                this.logger.debug(`...Content field definition "%s" already exists.`, contentFieldDefinition.getName());
                return Result.error(`Content field definition "${ contentFieldDefinition.getName() }" already exists.`);
            }

            const id = await contentDefinitionRepository.createContentFieldDefinition(contentFieldDefinition);
    
            this.logger.debug(`...Content field definition "%s" created successfully.`, contentFieldDefinition.getName());
            return Result.success(id);
        }

        catch (error) {
            this.logger.debug(`...Failed to create content field "%s".`, contentFieldDefinition.getName());
            throw error;
        }
    }
}

export default new CreateContentFieldDefinition();
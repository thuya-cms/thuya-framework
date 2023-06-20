import { Result } from "../../../../common";
import Logger from "../../../../common/utility/logger";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition/content-definition";

/**
 * Use case to read content definition.
 */
class ReadContentDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(ReadContentDefinition.name);
    }



    /**
     * Execute reading content definition by name.
     * 
     * @param contentDefinitionName name of the content definition to read
     * @returns result containing the content definition
     * @async
     */
    async byName(contentDefinitionName: string): Promise<Result<ContentDefinition | undefined>> {
        this.logger.debug(`Start reading content definition "%s"...`, contentDefinitionName);

        try {
            const contentDefinition = await contentDefinitionRepository.readContentDefinitionByName(contentDefinitionName);
    
            if (!contentDefinition) {
                this.logger.debug(`...Content definition "%s" not found.`, contentDefinitionName);
                return Result.error(`Content definition "${ contentDefinitionName }" not found.`);
            }
    
            this.logger.debug(`...Content definition "%s" found.`, contentDefinitionName);
            return Result.success(contentDefinition);
        }

        catch (error) {
            this.logger.debug(`...Failed to read content definition "%s".`, contentDefinitionName);
            throw error;
        }
    }
}

export default new ReadContentDefinition();
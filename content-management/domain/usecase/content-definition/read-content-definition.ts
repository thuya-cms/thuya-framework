import { Result } from "../../../../common";
import Logger from "../../../../common/utility/logger";
import contentDefinitionRepository from "../../../repository/content-definition-repository";
import { ContentDefinition } from "../../entity/content-definition";

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
     * @param contentName name of the content definition to read
     * @returns result containing the content definition
     */
    async execute(contentName: string): Promise<Result<ContentDefinition>> {
        this.logger.debug(`Start reading content definition "%s"...`, contentName);

        try {
            const contentDefinition = await contentDefinitionRepository.readContentDefinition(contentName);
    
            if (!contentDefinition) {
                this.logger.debug(`...Content definition not found.`);
                return Result.error(`Content definition "${ contentName }" not found.`);
            }
    
            this.logger.debug(`...Content definition "%s" found.`, contentName);
            return Result.success(contentDefinition);
        }

        catch (error) {
            this.logger.debug(`...Failed to read content definition "%s".`, contentName);
            throw error;
        }
    }
}

export default new ReadContentDefinition();
import { Result } from '../../../../common';
import Logger from '../../../../common/utility/logger';
import contentDefinitionRepository from '../../../repository/content-definition-repository';
import { ContentDefinition } from '../../entity/content-definition';

/**
 * Use case to create a content definition.
 */
class CreateContentDefinition {
    private logger: Logger;



    constructor() {
        this.logger = Logger.for(CreateContentDefinition.name);
    }



    /**
     * Execute content definition creation.
     * 
     * @param contentDefinition the content definition to create
     * @returns result containing the id of the created content definition as a result
     */
    async execute(contentDefinition: ContentDefinition): Promise<Result<string>> {
        this.logger.debug(`Start creating content definition "%s"...`, contentDefinition.getName());
        
        try {
            const existingContentDefinition = await contentDefinitionRepository.readContentDefinition(contentDefinition.getName());
            if (existingContentDefinition) {
                this.logger.debug(`Content definition "%s" already exists.`, contentDefinition.getName());
                return Result.error(`Content definition "${ contentDefinition.getName() }" already exists.`);
            }
            
            const id = await contentDefinitionRepository.createContentDefinition(contentDefinition);
    
            this.logger.debug(`...Content definition "%s" created successfully.`, contentDefinition.getName());
            return Result.success(id);
        }
        
        catch (error) {
            this.logger.error(`...Creation of content definition "%s" failed.`, contentDefinition.getName());
            throw error;
        }
    }
}

export default new CreateContentDefinition();
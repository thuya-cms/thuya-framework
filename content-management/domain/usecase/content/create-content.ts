import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import logger from "../../../../common/utility/logger";
import expressHelper from "../../../../common/utility/express-helper";
import IdentifiableError from "../../../../identifiable-error";

enum ErrorCode {
    Required = "required",
}

class CreateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T): string {
        try {
            let finalContent: any = {};

            expressHelper.deleteNotExistingProperties(content, contentDefinition);
            contentDefinition.getContentFields().forEach(contentField => {
                let fieldValue = expressHelper.getFieldValue(contentField.name, content);
                
                if (contentField.options.isRequired && !fieldValue)
                    throw new IdentifiableError(ErrorCode.Required, `Field ${ contentField.name } is required.`);

                contentField.contentFieldDefinition.validateValue(fieldValue);
                fieldValue = contentField.contentFieldDefinition.executeDeterminations(fieldValue);

                finalContent[contentField.name] = fieldValue;
            });
    
            let id = factory.getPersistency().createContent(contentDefinition.getName(), finalContent);

            logger.info(`Content of type '${ contentDefinition.getName() }' is created successfully.`);

            return id;
        }

        catch (error: any) {
            logger.error(error.message);
            
            throw error;
        }
    }
}

export default new CreateContent();
export { ErrorCode };
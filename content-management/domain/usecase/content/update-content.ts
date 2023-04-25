import expressHelper from "../../../../common/utility/express-helper";
import IdentifiableError from "../../../../identifiable-error";
import logger from "../../../../common/utility/logger";
import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";

enum ErrorCode {
    Required = "required",
}

class UpdateContent<T> {
    execute(contentDefinition: ContentDefinition<T>, content: T) {
        try {
            let finalContent: any = {};

            expressHelper.deleteNotExistingProperties(content, contentDefinition);
            contentDefinition.getContentFields().forEach(contentField => {
                let fieldValue = expressHelper.getFieldValue(contentField.name, content);
                contentField.contentFieldDefinition.validateValue(fieldValue);
                contentField.contentFieldDefinition.executeDeterminations(fieldValue);

                if (contentField.options.isRequired && !fieldValue)
                    throw new IdentifiableError(ErrorCode.Required, `Field ${ contentField.name } is required.`);

                finalContent[contentField.name] = fieldValue;
            });
    
            factory.getPersistency().updateContent(contentDefinition.getName(), content);

            logger.info(`Content of type '${ contentDefinition.getName() }' is updated successfully.`);
        }

        catch (error: any) {
            logger.error(error.message);
            
            throw error;
        }
    }
}

export default new UpdateContent();
export { ErrorCode };
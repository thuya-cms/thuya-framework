import { ContentDefinition } from "../../entity/content-definition";
import factory from "../../factory";
import logger from "../../../../common/utility/logger";
import expressHelper from "../../../../common/utility/express-helper";
import IdentifiableError from "../../../../common/identifiable-error";
import contentManager from "../../../app/content-manager";

enum ErrorCode {
    Required = "required",
    NotUnique = "not-unique"
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

                if (contentField.options.isUnique) {
                    this.validateUniqueness(contentDefinition, contentField, fieldValue);
                }

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

    
    private validateUniqueness(contentDefinition: ContentDefinition<T>, contentField: { name: string; contentFieldDefinition: import("c:/Users/I323151/Documents/thuya/thuya-framework/content-management/domain/entity/content-field-definition/content-field-definition").ContentFieldDefinition; options: { isRequired?: boolean | undefined; isUnique?: boolean | undefined; }; }, fieldValue: any) {
        let duplicate: any;

        try {
            duplicate = contentManager.readContentByFieldValue(contentDefinition.getName(), { name: contentField.name, value: fieldValue });
        }

        catch (error) {
            duplicate = undefined; // No duplicate.
        }

        if (duplicate)
            throw new IdentifiableError(ErrorCode.NotUnique, `Field ${contentField.name} is not unique.`);
    }
}

export default new CreateContent();
export { ErrorCode };
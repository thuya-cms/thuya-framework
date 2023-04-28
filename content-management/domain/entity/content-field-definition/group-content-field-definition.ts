import { IdentifiableError, logger } from "../../../../common";
import contentHelper from "../../../../common/utility/content-helper";
import expressHelper from "../../../../common/utility/express-helper";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

enum ErrorCode {
    DuplicateField = "duplicate-field",
    Required = "required"
}

type ContentFieldOptions = {
    isRequired?: boolean
}

class GroupContentFieldDefinition extends ContentFieldDefinition {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];

    
    
    constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Group);
    }



    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions) {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            logger.error(`Field with name "%s" is already added to group "%s".`, name, this.getName());
            throw new IdentifiableError(ErrorCode.DuplicateField, `Field with name "${ name }" is already added to group "${ this.getName() }".`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        logger.debug(`Field "%s" is added to group "%s".`, name, this.getName());
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }

    override validateValue(fieldValue: ContentFieldValue): void {
        this.getContentFields().forEach(contentField => {
            let propertyName = contentHelper.getContentPropertyName(contentField.name, fieldValue);
            let singleFieldValue;

            if (propertyName)
                singleFieldValue = contentHelper.getFieldValue(propertyName.toString(), fieldValue);

            if (contentField.options.isRequired && !singleFieldValue) {
                logger.debug(`Value for field "%s" is required.`, contentField.name);
                throw new IdentifiableError(ErrorCode.Required, `Value for field ${ contentField.name } is required.`);
            }

            contentField.contentFieldDefinition.validateValue(singleFieldValue);
        });
        
        super.validateValue(fieldValue);
    }
    
    override executeDeterminations(fieldValue: any): ContentFieldValue {
        expressHelper.deleteNotExistingProperties(fieldValue, this.getContentFields().map(contentField => contentField.name));
        
        return super.executeDeterminations(fieldValue);
    }
}

export { GroupContentFieldDefinition, ErrorCode };
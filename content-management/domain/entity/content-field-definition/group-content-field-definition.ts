import { Result, logger } from "../../../../common";
import contentHelper from "../../../../common/utility/content-helper";
import expressHelper from "../../../../common/utility/express-helper";
import { ContentFieldDefinition, ContentFieldType, ContentFieldValue } from "./content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean
}

class GroupContentFieldDefinition extends ContentFieldDefinition {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];

    
    
    protected constructor(id: string, name: string) {
        super(id, name, ContentFieldType.Group);
    }



    static create(id: string, name: string): Result<GroupContentFieldDefinition> {
        try {
            let contentFieldDefinition = new GroupContentFieldDefinition(id, name);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            logger.error(`Field with name "%s" is already added to group "%s".`, name, this.getName());
            return Result.error(`Field with name "${ name }" is already added to group "${ this.getName() }".`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        logger.debug(`Field "%s" is added to group "%s".`, name, this.getName());

        return Result.success();
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }

    override validateValue(fieldValue: ContentFieldValue): Result {
        for (let contentField of this.getContentFields()) {
            let propertyName = contentHelper.getContentPropertyName(contentField.name, fieldValue);
            let singleFieldValue;

            if (propertyName)
                singleFieldValue = contentHelper.getFieldValue(propertyName.toString(), fieldValue);

            if (contentField.options.isRequired && !singleFieldValue) {
                logger.debug(`Value for field "%s" is required.`, contentField.name);
                return Result.error(`Value for field "${ contentField.name }" is required.`);
            }

            let result = contentField.contentFieldDefinition.validateValue(singleFieldValue);

            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
    
    override executeDeterminations(fieldValue: any): ContentFieldValue {
        expressHelper.deleteNotExistingProperties(fieldValue, this.getContentFields().map(contentField => contentField.name));
        
        return super.executeDeterminations(fieldValue);
    }
}

export default GroupContentFieldDefinition;
import { Result, Logger } from "../../../../common";
import contentHelper from "../../../../common/utility/content-helper";
import expressHelper from "../../../../common/utility/express-helper";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean
}

class GroupContentFieldDefinition<T = any> extends ContentFieldDefinition<T> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];

    
    
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Group, filePath);

        this.logger = Logger.for(GroupContentFieldDefinition.name);
    }



    static create(id: string, name: string, filePath?: string): Result<GroupContentFieldDefinition> {
        try {
            const contentFieldDefinition = new GroupContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    addContentField(name: string, contentField: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            this.logger.error(`Field with name "%s" is already added to group "%s".`, name, this.getName());
            return Result.error(`Field with name "${ name }" is already added to group "${ this.getName() }".`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentField,
            options: options || {}
        });

        this.logger.debug(`Field "%s" is added to group "%s".`, name, this.getName());

        return Result.success();
    }

    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }

    override validateValue(fieldValue: any): Result {
        for (const contentField of this.getContentFields()) {
            const singleFieldValue = contentHelper.getFieldValue(contentField.name, fieldValue);

            if (contentField.options.isRequired && !singleFieldValue) {
                this.logger.debug(`Value for field "%s" is required.`, contentField.name);
                return Result.error(`Value for field "${ contentField.name }" is required.`);
            }

            const result = contentField.contentFieldDefinition.validateValue(singleFieldValue);

            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
    
    override executeDeterminations(fieldValue: any): any {
        expressHelper.deleteNotExistingProperties(fieldValue, this.getContentFields().map(contentField => contentField.name));
        
        return super.executeDeterminations(fieldValue);
    }
}

export default GroupContentFieldDefinition;
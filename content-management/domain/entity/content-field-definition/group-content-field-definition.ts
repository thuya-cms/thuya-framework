import { Result, Logger } from "../../../../common";
import contentHelper from "../../../../common/utility/content-helper";
import { ContentFieldDefinition, ContentFieldType } from "./content-field-definition";

type ContentFieldOptions = {
    isRequired?: boolean
}

/**
 * Content field definition that represents a group of content fields.
 */
class GroupContentFieldDefinition<T = any> extends ContentFieldDefinition<T> {
    private contentFields: { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] = [];

    
    
    protected constructor(id: string, name: string, filePath?: string) {
        super(id, name, ContentFieldType.Group, filePath);

        this.logger = Logger.for(GroupContentFieldDefinition.name);
    }



    /**
     * Create a new instance of a group content field definition.
     * 
     * @param id id of the content field definition
     * @param name name of the content field definition
     * @param filePath the path of the content field definition implementation
     * @returns an instance of a new content field definition
     */
    static create(id: string, name: string, filePath?: string): Result<GroupContentFieldDefinition> {
        try {
            const contentFieldDefinition = new GroupContentFieldDefinition(id, name, filePath);
            return Result.success(contentFieldDefinition);
        }

        catch (error: any) {
            return Result.error(error.message);
        }
    }


    /**
     * Add a new content field to the group.
     * 
     * @param name name of the content field
     * @param contentFieldDefinition the content field definition
     * @param options options of the content field
     * @returns result
     */
    addContentField(name: string, contentFieldDefinition: ContentFieldDefinition, options?: ContentFieldOptions): Result {
        if (this.contentFields.find(existingContentField => existingContentField.name === name)) {
            this.logger.debug(`Field with name "%s" is already added to group "%s".`, name, this.getName());
            return Result.error(`Field with name "${ name }" is already added to group "${ this.getName() }".`);
        }

        this.contentFields.push({
            name: name,
            contentFieldDefinition: contentFieldDefinition,
            options: options || {}
        });

        this.logger.debug(`Field "%s" is added to group "%s".`, name, this.getName());
        return Result.success();
    }

    /**
     * @returns the content fields of the group 
     */
    getContentFields(): { name: string, contentFieldDefinition: ContentFieldDefinition, options: ContentFieldOptions }[] {
        return this.contentFields;
    }

    /**
     * @inheritdoc
     */
    override validateValue(fieldValue: any): Result {
        for (const contentField of this.getContentFields()) {
            const singleFieldValue = contentHelper.getFieldValue(contentField.name, fieldValue);

            const isRequiredValidationResult = contentHelper.validateRequiredField(contentField.options.isRequired || false, singleFieldValue, contentField.name);
            if (isRequiredValidationResult.getIsFailing())
                return Result.error(isRequiredValidationResult.getMessage());

            const result = contentField.contentFieldDefinition.validateValue(singleFieldValue);

            if (result.getIsFailing()) return result;
        }
        
        return super.validateValue(fieldValue);
    }
    
    /**
     * @inheritdoc
     */
    override executeDeterminations(fieldValue: any): any {
        contentHelper.deleteNotExistingProperties(fieldValue, this.getContentFields().map(contentField => contentField.name));

        for (const contentField of this.getContentFields()) {
            const singleFieldValue = contentHelper.getFieldValue(contentField.name, fieldValue);
            const updatedFieldValue = contentField.contentFieldDefinition.executeDeterminations(singleFieldValue);
            
            fieldValue[contentField.name] = updatedFieldValue;
        }
        
        return super.executeDeterminations(fieldValue);
    }
}

export default GroupContentFieldDefinition;
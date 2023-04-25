import { Request } from "express";
import { ContentFieldDefinition } from "../../content-management/domain/entity/content-field-definition/content-field-definition";
import { ContentDefinition } from "../../content-management/domain/entity/content-definition";

class ExpressHelper {
    getContentName(request: Request) {
        return request.url.split("/")[1];
    }

    adjustContentFieldName(contentField: ContentFieldDefinition, contentName: string): string {
        return contentField.getName().toLowerCase()
            .replace(contentName, "")
            .replace(/-/g, "");
    }

    deleteNotExistingProperties(content: any, contentDefinition: ContentDefinition<any>) {
        for (const contentProperty in content) {
            if (!this.contentFieldExists(contentDefinition, contentProperty))
                delete content[contentProperty];
        }
    }

    getContentPropertyName(contentField: ContentFieldDefinition, contentName: string, content: any): keyof typeof content | undefined {
        let fieldNameLowerCase = this.adjustContentFieldName(contentField, contentName);
        let propertyNameAsKey: keyof typeof content | undefined;

        for (const contentProperty in content) {
            if (contentProperty.toLowerCase() === fieldNameLowerCase) {
                propertyNameAsKey = contentProperty;
                break;
            }
        }  

        return propertyNameAsKey;
    }

    getFieldValue(fieldName: string, content: any) {
        let propertyNameAsKey: keyof any = fieldName;

        return content[propertyNameAsKey];
    }
    

    private contentFieldExists(contentDefinition: ContentDefinition<any>, contentProperty: Extract<keyof any, string>) {
        let contentFields = contentDefinition.getContentFields();

        return contentFields.find(contentField => this.adjustContentFieldName(contentField.contentFieldDefinition, contentDefinition.getName()) === contentProperty.toLowerCase());
    }
}

export default new ExpressHelper();
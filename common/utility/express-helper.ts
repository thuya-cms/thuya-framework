import { Request } from "express";
import { ContentFieldDefinition } from "../../content-management/domain/entity/content-field-definition";
import { ContentDefinition } from "../../content-management/domain/entity/content-definition";

class ExpressHelper {
    getContentName(request: Request) {
        return request.url.split("/")[1];
    }

    adjustContentFieldName(contentField: ContentFieldDefinition, contentName: string) {
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
    

    private contentFieldExists(contentDefinition: ContentDefinition<any>, contentProperty: Extract<keyof any, string>) {
        let contentFields = contentDefinition.getContentFields();

        return contentFields.find(contentField => this.adjustContentFieldName(contentField, contentDefinition.getName()) === contentProperty.toLowerCase());
    }
}

export default new ExpressHelper();
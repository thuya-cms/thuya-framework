import factory from "../factory";
import IContentItem, { of as contentItemOf } from "./content-item";
import IContentType from "./content-type";

class ContentManager {
    public list(contentType: IContentType): IContentItem<any>[] {
        const persistencyData = factory.getPersistency().list(contentType);
        let result: IContentItem<any>[] = [];

        persistencyData.forEach(data => {
            result.push(contentItemOf(data));
        });

        return result;
    }

    public get(contentType: IContentType, id: string): IContentItem<any> {
        let result: any = {};
        let resultContentItem: IContentItem<any>;
        
        contentType.fields.forEach(contentPart => {
            result[contentPart.name] = `${contentPart.name} value`;
        });

        return contentItemOf(result);
    }

    public create(contentType: IContentType, contentItem: IContentItem<any>): void {
        let data: any = {};
        
        data["id"] = contentItem.id;
        
        for (const property in contentItem.getData()) {
            if (contentType.fields.find(field => field.name === property))
                data[property] = contentItem.getData()[property];
        }

        factory.getPersistency().create(contentType, data);
    }
}

export default new ContentManager();

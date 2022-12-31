import factory from "../factory";
import IContentItem, { of as contentItemOf } from "./content-item";
import IContentType from "./content-type";

class ContentManager {
    public list(contentType: IContentType): IContentItem[] {
        const persistencyData = factory.getPersistency().list(contentType);
        let result: IContentItem[] = [];

        persistencyData.forEach(data => {
            result.push(contentItemOf(data));
        });

        return result;
    }

    public get(contentType: IContentType, id: string): IContentItem {
        let result: any = {};
        
        contentType.fields.forEach(contentPart => {
            result[contentPart.name] = `${contentPart.name} value`;
        });

        return result;
    }

    public create(contentType: IContentType, contentItem: IContentItem): void {
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

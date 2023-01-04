import factory from "../factory";
import IContentItem, { of as contentItemOf } from "./content-item";
import IContentType from "./content-type";

class ContentItemManager {
    public list(contentType: IContentType): IContentItem<any>[] {
        const persistencyData = factory.getPersistency().contentItemPersistency.list(contentType);
        let result: IContentItem<any>[] = [];

        persistencyData.forEach(data => {
            result.push(contentItemOf(data));
        });

        return result;
    }

    public get(contentType: IContentType, id: string): IContentItem<any> {
        const persistencyData = factory.getPersistency().contentItemPersistency.get(contentType, id);

        return contentItemOf(persistencyData);
    }

    public create(contentType: IContentType, contentItem: IContentItem<any>): void {
        let data: any = {};
        
        data["id"] = contentItem.id;
        
        for (const property in contentItem.getData()) {
            if (contentType.fields.find(field => field.name === property))
                data[property] = contentItem.getData()[property];
        }

        factory.getPersistency().contentItemPersistency.create(contentType, data);
    }
}

export default new ContentItemManager();

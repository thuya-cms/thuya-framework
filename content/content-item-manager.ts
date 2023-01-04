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

    /**
     * Create a new content item of a goven content type.
     * 
     * @param contentType content type of the content item 
     * @param contentItem the content item to create
     * @throws will throw an exception if data is not valid
     */
    public create(contentType: IContentType, contentItem: IContentItem<any>): void {
        contentType.fields.forEach(field => {
            if (field.required) {
                if (!contentItem.getData()[field.name])
                    throw new Error(`Property "${field.name}" is required.`)       
            }
        });
        
        let data: any = this.flattenContentItemData(contentItem, contentType);

        factory.getPersistency().contentItemPersistency.create(contentType, data);
    }


    private flattenContentItemData(contentItem: IContentItem<any>, contentType: IContentType) {
        let data: any = {};

        data["id"] = contentItem.id;

        for (const property in contentItem.getData()) {
            if (contentType.fields.find(field => field.name === property))
                data[property] = contentItem.getData()[property];
        }
        return data;
    }
}

export default new ContentItemManager();

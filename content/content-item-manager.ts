import factory from "../factory";
import IContentItem, { of as contentItemOf } from "./content-item";
import IContentType, { ContentTypeFieldType } from "./content-type";

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

            switch (field.type) {
                case ContentTypeFieldType.string:
                    // Everything is a valid string.
                    break;

                case ContentTypeFieldType.number:
                    if (Number.isNaN(Number(contentItem.getData()[field.name])))
                        throw new Error(`Value of property "${field.name}" is not a number.`);
                    break;

                case ContentTypeFieldType.date:
                    // Date needs to be provided as the number of milliseconds since 1970 January 1.
                    if (Number.isNaN(Number(contentItem.getData()[field.name])))
                        throw new Error(`Value of property "${field.name}" is not a date in milliseconds since 1970 January 1.`);
                    break;

                default:
                    throw new Error(`Unknow filed type for property ${field.name}.`);
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

import IContentType from "../../content/content-type";
import IContentItemPersistency from "../../persistency/content-item-persistency";
import IContentTypePersistency from "../../persistency/content-type-persistency";
import IPersistency from "../../persistency/persistency";

class ContentItemPersistency implements IContentItemPersistency {
    private _localContentItems: { contentTypeId: string, data: any[] }[] = [];



    get(contentType: IContentType, id: string) {
        const localData = this._localContentItems.find(data => data.contentTypeId === contentType.id);
        
        if (!localData)
            return null;
        
        const localContentItem = localData.data.find(localDataItem => localDataItem.id === id);

        if (!localContentItem)
            return null;

        return localContentItem;
    }

    list(contentType: IContentType): any[] {
        const localData = this._localContentItems.find(data => data.contentTypeId === contentType.id);

        if (!localData)
            return [];

        return localData.data;
    }

    create(contentType: IContentType, data: any): void {
        let localData = this._localContentItems.find(data => data.contentTypeId === contentType.id);

        if (!localData) {
            localData = {
                contentTypeId: contentType.id, 
                data: []
            };
            this._localContentItems.push(localData);
        }

        localData.data.push(data);
    }
}

class ContentTypePersistency implements IContentTypePersistency {
    private _localContentTypes: { data: any }[] = [];



    get(id: string) {
        throw new Error("Method not implemented.");
    }

    list(): any[] {
        return this._localContentTypes;
    }

    create(data: any): void {
        this._localContentTypes.push(data);
    }
}

class LocalPersistency implements IPersistency {
    contentItemPersistency: IContentItemPersistency = new ContentItemPersistency();
    contentTypePersistency: IContentTypePersistency = new ContentTypePersistency();
}

export default new LocalPersistency();

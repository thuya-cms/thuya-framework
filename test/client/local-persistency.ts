import IContentType from "../../content/content-type";
import IPersistency from "../../persistency/persistency";

class LocalPersistency implements IPersistency {
    private _localStore: { contentTypeId: string, data: any[] }[] = [];


    get(contentType: IContentType, id: string) {
        throw new Error("Method not implemented.");
    }

    list(contentType: IContentType): any[] {
        const localData = this._localStore.find(data => data.contentTypeId === contentType.id);

        if (!localData)
            return [];

        return localData.data;
    }

    create(contentType: IContentType, data: any): void {
        let localData = this._localStore.find(data => data.contentTypeId === contentType.id);

        if (!localData) {
            localData = {
                contentTypeId: contentType.id, 
                data: []
            };
            this._localStore.push(localData);
        }

        localData.data.push(data);
    }
}

export default new LocalPersistency();

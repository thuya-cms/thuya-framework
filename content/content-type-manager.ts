import factory from "../factory";
import IContentType from "./content-type";

class ContentTypeManager {
    private _contentTypes: IContentType[] = [];


    
    add(contentType: IContentType) {
        this._contentTypes.push(contentType);
    }

    create(contentType: IContentType) {
        factory.getPersistency().contentTypePersistency.create({
            id: contentType.id,
            fields: contentType.fields
        });
    }

    list(): IContentType[] {
        const contentTypes = this.listFromPersistency();

        this._contentTypes.forEach(contentType => {
            contentTypes.push(contentType);
        });

        return contentTypes;
    }


    private listFromPersistency(): IContentType[] {
        const contentTypesData = factory.getPersistency().contentTypePersistency.list();
        const contentTypes: IContentType[] = [];

        contentTypesData.forEach(contentTypeData => {
            contentTypes.push({
                id: contentTypeData.id,
                fields: contentTypeData.fields
            });
        });

        return contentTypes;
    }
}

export default new ContentTypeManager();

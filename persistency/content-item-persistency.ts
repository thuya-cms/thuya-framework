import IContentType from "../content/content-type";

interface IContentItemPersistency {
    get(contentType: IContentType, id: string): any;
    list(contentType: IContentType): any[];
    create(contentType: IContentType, data: any): void;
}

export default IContentItemPersistency;

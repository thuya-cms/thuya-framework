import IContentType from "../content/content-type";

interface IContentTypePersistency {
    get(id: string): any;
    list(): any[];
    create(data: any): void;
}

export default IContentTypePersistency;
